token 4752f9f4fe401db:a63671d32050761
curl http://localhost:8080/api/resource/Item?or_filters=%5B%5B%22name%22%2C%22%3D%22%2C%22A-001%22%5D%2C%5B%22name%22%2C%22%3D%22%2C%22C-001%22%5D%2C%5B%22name%22%2C%22%3D%22%2C%22C-002%22%5D%5D&fields=%5B%22name%22%2C%22item_group%22%2C%22valuation_rate%22%5D -H "Authorization: token 4752f9f4fe401db:a63671d32050761" | jq

