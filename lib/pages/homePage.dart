import 'dart:ffi';

import 'package:flutter/material.dart';
import 'package:keycrypt_desktop/service/getKeys.dart';
import 'package:sqflite/sqflite.dart';
import 'package:path/path.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';

import 'dart:convert';

class Homepage extends StatefulWidget {
  final String data;

  const Homepage({super.key, required this.data});

  @override
  State<Homepage> createState() => _HomepageState();
}

class _HomepageState extends State<Homepage> {
  Database? _database;
  bool _isLoading = false;
  List<dynamic> _items = [];

  void saveToken() async {
    final storage = const FlutterSecureStorage();
    try {
      await storage.write(key: 'token', value: widget.data);
    } catch (e) {
      await storage.delete(key: 'token');
    } finally {
      await storage.write(key: 'token', value: widget.data);
    }
  }

//initialize database
  Future<void> _initDB() async {
    setState(() {
      _isLoading = true;
    });

    try {
      String path = join(await getDatabasesPath(), 'my_database.db');
      print("Database path: $path");

      bool dbExists = await databaseExists(path);

      if (dbExists) {
        print("Database already exists. Opening the database...");
        _database = await openDatabase(path);
        print("Database Loaded!!!....");
      } else {
        print("Database does not exist. Creating a new database...");
        _database = await openDatabase(
          path,
          version: 1,
          onCreate: (db, version) {
            return db.execute("""
          CREATE TABLE `items` (
            `id` INTEGER PRIMARY KEY AUTOINCREMENT,
            `key_name` TEXT,
            `key_value` TEXT,
            `key_type` TEXT,
            `user_id` INTEGER,
            `updated_at` TEXT,
            `created_at` TEXT
          );
        """);
          },
        );
        print('Database created successfully');
      }

      await _syncCloudData();
      await _loadItems();
    } catch (e) {
      print(e);
    } finally {
      setState(() {
        _isLoading = false;
      });
    }
  }

//insert items via user input
  Future<void> _insertItem(String keys, String value) async {
    if (_database != null) {
      print('Inserting item: $value');
      await _database!.insert(
        'items',
        {'key_name': keys, 'key_value': value},
        conflictAlgorithm: ConflictAlgorithm.replace,
      );
    }
  }

//insert items via cloud
  Future<void> _syncItems(int id, String keys, String value) async {
    if (_database != null) {
      print('Inserting item: $value');
      if (keyExist(id) != true) {
        await _database!.insert(
          'items',
          {'id': id, 'key_name': keys, 'key_value': value},
          conflictAlgorithm: ConflictAlgorithm.replace,
        );
      }
    }
  }

//load data from database
  Future<void> _loadItems() async {
    if (_database != null) {
      final List<Map<dynamic, dynamic>> maps = await _database!.query('items');

      setState(() {
        _items = maps
            .map((map) {
              return map['key_value'];
            })
            .where((item) => item != null)
            .cast<String>()
            .toList();
      });
    }
  }

//sync data from cloud
  Future<void> _syncCloudData() async {
    print('SYNCING.......');

    try {
      // Get the keys as a String (it could be null)
      String? keysResponse = await getKeys();

      // Check if the response is not null
      if (keysResponse != null) {
        // Parse the JSON string into a List of Maps
        final dynamic parsedResponse = jsonDecode(keysResponse);

        // Ensure it's a list and convert it to the correct type
        if (parsedResponse is List) {
          List<Map<String, dynamic>> keyList =
              List<Map<String, dynamic>>.from(parsedResponse);

          // Print the keys in a readable format
          for (var key in keyList) {
            print(
                'ID: ${key['id']}, Name: ${key['name']}, Value: ${key['value']}');
            await _syncItems(key['id'], key['name'], key['value']);
          }
        } else {
          print('Unexpected response format: $parsedResponse');
        }
      } else {
        print('No keys received.');
      }
    } catch (e) {
      print('Error syncing data: $e');
    }
    print('SYNCED....');
  }

  Future<bool> keyExist(int id) async {
    if (_database != null) {
      final List<Map<String, dynamic>> result = await _database!.query(
        'items',
        where: 'id = ?',
        whereArgs: [id],
      );
      return result.isNotEmpty;
    }
    return false;
  }

  @override
  void initState() {
    super.initState();
    saveToken();
    _initDB();
  }

  @override
  void dispose() {
    _database?.close();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Home Page'),
        titleTextStyle: Theme.of(context).textTheme.bodyLarge,
        backgroundColor: const Color(0xFF111518),
      ),
      body: Center(
        child: _isLoading
            ? const Center(
                child: CircularProgressIndicator(
                  valueColor: AlwaysStoppedAnimation(Colors.amberAccent),
                  backgroundColor: Colors.blueAccent,
                ),
              )
            : Column(
                children: [
                  const SizedBox(height: 20),
                  Expanded(
                    child: _items.isEmpty
                        ? const Center(
                            child: Text('No items available'),
                          )
                        : ListView.builder(
                            itemCount: _items.length,
                            itemBuilder: (context, index) {
                              return ListTile(
                                title: Text(
                                    style: const TextStyle(color: Colors.white),
                                    _items[index] ?? 'No Value'),
                              );
                            },
                          ),
                  ),
                ],
              ),
      ),
    );
  }
}
