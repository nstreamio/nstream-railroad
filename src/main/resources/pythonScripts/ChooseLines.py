def filter_lines(input_file, output_file, lines_to_keep):
    with open(input_file, 'r') as f_input, open(output_file, 'w') as f_output:
        for line_number, line in enumerate(f_input, start=1):
            if line_number in lines_to_keep:
                f_output.write(line)

# Keep specific lines from the input file
lines_to_keep = {1, 5, 9, 13, 17, 21, 25, 29, 33, 37, 41, 45, 49, 53, 57, 61, 65, 69, 73, 77, 81, 85, 89, 93, 97, 101, 105, 109, 113, 117, 121, 125, 129, 133, 137, 141, 145, 149, 153, 157, 161, 165, 169, 173, 177, 181, 185, 189, 193, 197, 201, 205, 209}
input_file_path = 'input.txt'
output_file_path = 'output.txt'

filter_lines(input_file_path, output_file_path, lines_to_keep)
