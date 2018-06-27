# Tips and Tricks

## How to show the steps from CodeceptJS in Portuguese:

1. Edit `codecept.json` and add the key `translation` with the value `pt-BR`:

```json
{
   ...
   "translation": "pt-BR"
}
```


## How to generate HTML reports with CodeceptJS:

1. Install **mochawesome** as a *development* dependency:

    ```bash
    npm install --save-dev mochawesome
    ```

2. Edit `codecept.json` and add **mochawesome** to `reporterOptions`:

    ```json
    ...
	"mocha": {
		"reporterOptions": {

			...

			"mochawesome": {
				"stdout": "-",
				"options": {
					"reportDir": "./output",
					"reportFilename": "report",
					"timestamp": true,
					"autoOpen": true
				}
			}
		}
	}
    ...
    ```

The reports will be generared to the folder `output`.

Extra tips:
- Option `timestamp` makes it to generate a different report name on every execution. This is fine when you have to keep all the reports for historical reasons or audit. You may remove this option or turn it to `false` if it is not the case.
- Option `autoOpen` makes it to open the generated report with the default browser after the tests are finished.
- See [additional report options](https://github.com/adamgruber/mochawesome-report-generator).