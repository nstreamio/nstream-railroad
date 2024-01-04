# Railroad Demo

## Prerequisites

* [Install JDK 17+](https://www.oracle.com/technetwork/java/javase/downloads/index.html).
  * Ensure that your `JAVA_HOME` environment variable is pointed to your Java installation location.
  * Ensure that your `PATH` includes `$JAVA_HOME`.

* [Install Node.js](https://nodejs.org/en/).
  * Confirm that [npm](https://www.npmjs.com/get-npm) was installed during the Node.js installation.

## Run

### Windows

Install the [Windows Subsystem for Linux](https://docs.microsoft.com/en-us/windows/wsl/install-win10).

Execute the command `./run.sh` from a console pointed to the application's home directory. This will start a Swim server, seeded with the application's logic, on port 9001.

It will also compile the TypeScript sources, and bundle the generated Javascript. The resulting HTML document and JS libraries are copied to `server/src/main/resources/ui`. With the help of Swim's `UIRouter`, the contents of this directory are served at http://localhost:9001.
   ```console
    user@machine:~$ ./run.sh
   ```

### \*nix

Execute the command `./run.sh` from a console pointed to the application's home directory. This will start a Swim server, seeded with the application's logic, on port 9001.

It will also compile the TypeScript sources, and bundle the generated Javascript. The resulting HTML document and JS libraries are copied to `server/src/main/resources/ui`. With the help of Swim's `UIRouter`, the contents of this directory are served at http://localhost:9001.
   ```console
    user@machine:~$ ./run.sh
   ```

## Viewing UI

Once the application is running, open the following URL on your browser: http://localhost:9001.

