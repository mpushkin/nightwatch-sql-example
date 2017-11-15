import process from "child_process";

export function restoreDatabase(bakPath, dbName, oldDbName, owner, callback)
{
    const restoreProcess = process.spawn("sql-bak-restore", [bakPath, dbName, oldDbName, owner]);

    let stdout = "";
    let stderr = "";

    restoreProcess.stdout.on("data", (message) => { stdout += log(message); });
    restoreProcess.stderr.on("data", (message) => { stderr += log(message); });

    restoreProcess.on("exit", (code) =>{
        // console.log("Restore Database Exit code: " + code);
        if (code > 0) {
            const message = "sql-bak-restore failed" + (stderr ?
                    ": \r\n\r\n" + stderr : ".");
            callback(new Error(message));
        } else {
            callback();
        }
    });

    function log(message) {
        message = message.toString("utf8");
        // console.log(message);

        return message;
    }
}
