import argparse
import json

def read_env_file(env_file):
    with open(env_file, 'r') as file:
        lines = file.readlines()

    env_vars = [line.strip() for line in lines if line.strip() and not line.startswith('#')]

    json_vars = []
    for env_var in env_vars:
        name, value = env_var.split('=', 1)
        json_vars.append({
            "name": name,
            "value": value,
            "slotSetting": False  # Set to True if you want the setting to stick with the current slot when a swap is made.
        })

    print(json.dumps(json_vars, indent=2))


def main():
    parser = argparse.ArgumentParser(description='Read .env file and format for Azure App Service')
    parser.add_argument('-d', '--directory', required=True, help='Directory to the .env file')

    args = parser.parse_args()
    read_env_file(args.directory)


if __name__ == '__main__':
    main()
