import 'package:flutter/material.dart';
import 'package:sqflite/sqflite.dart';
import 'package:path/path.dart';

class Homepage extends StatefulWidget {
  final String data;

  const Homepage({super.key, required this.data});

  @override
  State<Homepage> createState() => _HomepageState();
}

class _HomepageState extends State<Homepage> {
  Database? _database;
  List<dynamic> _items = [];

  Future<void> _initDB() async {
    String path = join(await getDatabasesPath(), 'my_database.db');
    print("Database path: $path");

    _database = await openDatabase(
      path,
      onCreate: (db, version) {
        return db.execute(
          'CREATE TABLE items(id INTEGER PRIMARY KEY, key TEXT, value TEXT)',
        );
      },
      version: 1,
    );

    await _loadItems();
  }

  Future<void> _insertItem(String value) async {
    if (_database != null) {
      print('Inserting item: $value');
      await _database!.insert(
        'items',
        {'key': 'token', 'value': value},
        conflictAlgorithm: ConflictAlgorithm.replace,
      );
      await _loadItems();
    }
  }

  Future<void> _loadItems() async {
    if (_database != null) {
      final List<Map<dynamic, dynamic>> maps = await _database!.query('items');

      setState(() {
        _items = List.generate(maps.length, (i) {
          if (maps[i]['key'] != 'token') {
            return maps[i]['value'];
          } else {
            return null;
          }
        }).where((item) => item != null).toList();
      });
    }
  }

  @override
  void initState() {
    super.initState();
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
        backgroundColor: Color(0xFF111518),
      ),
      body: Center(
        child: Column(
          children: [
            Expanded(
              child: ListView.builder(
                itemCount: _items.length,
                itemBuilder: (context, index) {
                  return ListTile(
                    title: Text(_items[index]),
                  );
                },
              ),
            ),
            Padding(
              padding: const EdgeInsets.all(8.0),
              child: ElevatedButton(
                onPressed: () => _insertItem(widget.data),
                child: const Text('Insert Item'),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
