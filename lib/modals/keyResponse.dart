class KeyResponse {
  int? id; // Nullable integer for ID
  String? keyName; // Key name
  String? keyValue; // Key value
  String? keyType; // Key type
  String? createdAt; // Creation timestamp
  String? updatedAt; // Update timestamp

  // Constructor with all fields
  KeyResponse({
    this.id,
    this.keyName,
    this.keyValue,
    this.keyType,
    this.createdAt,
    this.updatedAt,
  });

  // Factory constructor for creating a KeyResponse from JSON
  factory KeyResponse.fromJson(Map<String, dynamic> json) {
    return KeyResponse(
      id: json['id'] as int?,
      keyName: json['key_name'] as String?,
      keyValue: json['key_value'] as String?,
      keyType: json['key_type'] as String?,
      createdAt: json['createdAt'] as String?,
      updatedAt: json['updatedAt'] as String?,
    );
  }

  // Method for converting KeyResponse to JSON
  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'key_name': keyName,
      'key_value': keyValue,
      'key_type': keyType,
      'createdAt': createdAt,
      'updatedAt': updatedAt,
    };
  }
}
