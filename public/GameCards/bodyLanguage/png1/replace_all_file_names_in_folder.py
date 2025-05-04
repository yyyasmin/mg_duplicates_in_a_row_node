import os

def replace_filenames(str1, str2):
    # Get list of files in current directory
    files = os.listdir()

    # Iterate over each file in the current directory
    for file_name in files:
        # Check if file is not a directory
        if os.path.isfile(file_name):
            # Check if the filename contains str1
            
            print("str1: ", str1)
            print("file_name: ", file_name)
            print("str1 in file_name: ", str1 in file_name)
            print("")
            
            if str1 in file_name:
                # Replace str1 with str2 in the filename
                new_file_name = file_name.replace(str1, str2)
                
                # Rename the file
                os.rename(file_name, new_file_name)
                print(f"Renamed {file_name} to {new_file_name}")

# Example usage:
str1 = "inti"
str2 = "p"
replace_filenames(str1, str2)
