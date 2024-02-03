import csv
import json

# Specify the path to your JSON file
json_file_path = "data/oaklandYard_data.json"

# Lists to store all latitudes and longitudes
all_latitudes = []
all_longitudes = []

# Load JSON data from file
with open(json_file_path, "r") as json_file:
    json_data = json.load(json_file)

# Process each element
for element in json_data["elements"]:
    # Create CSV file with id as filename
    filename = f"{element['id']}.csv"
    with open(filename, mode="w", newline="") as csv_file:
        csv_writer = csv.writer(csv_file)
        
        # Write header
        csv_writer.writerow(["latitude", "longitude"])
        
        # Write coordinates
        sorted_coordinates = sorted(element["geometry"], key=lambda x: x["lat"])
        for coord in sorted_coordinates:
            csv_writer.writerow([coord["lat"], coord["lon"]])
            
            # Append coordinates to lists
            all_latitudes.append(coord["lat"])
            all_longitudes.append(coord["lon"])

        # Create common.csv and write metadata
        common_filename = "common.csv"
        with open(common_filename, mode="a", newline="") as common_csv_file:
            common_csv_writer = csv.writer(common_csv_file)
            
            # Extract latitude and longitude pairs
            lat_lon_pairs = [f'{coord["lat"]},{coord["lon"]}' for coord in sorted_coordinates]
            
            # Write metadata line to common.csv
            common_csv_writer.writerow(["yardX", element["id"], ",".join(lat_lon_pairs)])
            
        # Copy lines from 1 to (N-1), reverse, and append below line number N
        for coord in reversed(sorted_coordinates[:-1]):
            csv_writer.writerow([coord["lat"], coord["lon"]])

# Calculate average latitude and average longitude
average_latitude = sum(all_latitudes) / len(all_latitudes)
average_longitude = sum(all_longitudes) / len(all_longitudes)

print(f"Average Latitude: {average_latitude}")
print(f"Average Longitude: {average_longitude}")
