# Actions

> Examples of Variant sentences with actions

*An example may demonstrate different variations of the same action.*

Translations: [Português](../pt/actions.md) 🌎

## `accept`

### accept + alert
```gherkin
When I accept the alert
```

### accept + confirm
```gherkin
When I accept the confirmation
```

### accept + popup
```gherkin
When I accept the popup
```

### accept + prompt
```gherkin
When I accept the prompt
```

## `amOn`

### amOn + value
```gherkin
Given that I am on "http://concordialang.org"
```

## `append`

### append + number + target
```gherkin
When I append "Foo" to {Foo}
  and I append "Bar" to <#foo>
```

### append + value + target
```gherkin
When I append 100 to {Bar}
  and I append 200 to <#foo>
```

## `attachFile`

This action selects the given file and confirm (*e.g.*, clicks OK).

### attach + file + value + target
```gherkin
When I attach the file "/path/to/file" to {Foo}
  and I attach the file "/path/to/file" to <#bar>
```

## `cancel`

### cancel + alert
```gherkin
When I cancel the alert
```

### cancel + confirm
```gherkin
When I cancel the confirmation
```

### cancel + popup
```gherkin
When I cancel the popup
```

### cancel + prompt
```gherkin
When I cancel the prompt
```

## `check`

### check + target
```gherkin
When I check {Foo}
  and I check <#bar>
```

## `clear`

### clear + target
```gherkin
When I clear {Foo}
  and I clear <#bar>
```

### clear + cookie + value
```gherkin
When I clear the cookie "foo"
```

## `click`

### click + target
```gherkin
When I click {Foo}
  and I click <#bar>
```

### click + value
```gherkin
When I click "Foo"
```

## `close`

### close + current tab
```gherkin
When I close the current tab
```

### close + other tabs
```gherkin
When I close the other tabs
```

### close + app
The next sentence is for *mobile* only:
```gherkin
When I close the app
```

## `connect`

The next sentence is for [Test Events](language.md#test-events) only:
### connect + database
```
When I connect to the database [TestDB]
```

## `disconnect`

The next sentence is for [Test Events](language.md#test-events) only:
### disconnect + database
```
When I disconnect from the database [TestDB]
```

## `doubleClick`

### doubleClick + target
```gherkin
When I double click {Foo}
  and I double click <#bar>
```

### doubleClick + value
```gherkin
When I double click "Foo"
```

## `drag`

### drag + target + target
```gherkin
When I drag {Foo} to <#bar>
```

## `fill`

### fill + target
```gherkin
When I fill {Foo}
  and I inform {Foo}
  and I enter {Foo}
  and I type {Foo}
```

### fill + target + with + value or number
```gherkin
When I fill {Foo} with "foo"
  and I fill <#bar> with "bar"
  and I fill <#bar> with 3.1415
```

### fill + value + inside + target
```gherkin
When I type "bar" in {Foo}
  and I type "foo" in <#bar>
```

## `hide`

### hide + keyboard
The next sentence is for *mobile* only:
```gherkin
When I hide the keyboard
```

## `install`

### install + app + value
The next sentence is for *mobile* only:
```gherkin
When I install the app "com.example.android.myapp"
```

## `maximize`

### maximize + window
```gherkin
When I maximize the window
```

## `move`

### move + cursor + target
```gherkin
When I move the cursor to {Foo}
  and I move the cursor to <#bar>
```

### move + cursor + target + number + number
```gherkin
When I move the cursor to {Foo} at 100, 200
```

## `open`

### open + notificationsPanel
The next sentence is for *mobile* only:
```gherkin
When I open the notifications panel
```

## `press`

Press a key or key combination, separated by comma.

### press + value
```gherkin
When I press "Enter"
  and I press "Control", "Alt", "Delete"
  and I press "Control", "S"
```

Some special keys (*case sensitive!*):

- `Add`
- `Alt`
- `ArrowDown` or `Down arrow`
- `ArrowLeft` or `Left arrow`
- `ArrowRight` or `Right arrow`
- `ArrowUp` or `Up arrow`
- `Backspace`
- `Command`
- `Control`
- `Del`
- `Divide`
- `End`
- `Enter`
- `Equals`
- `Escape`
- `F1` to `F12`
- `Home`
- `Insert`
- `Meta`
- `Multiply`
- `Numpad 0` to `Numpad 9`
- `Pause`
- `Pagedown` or `PageDown`
- `Pageup` or `PageUp`
- `Semicolon`
- `Shift`
- `Space`
- `Subtract`
- `Tab`


## `pull`

### pull + value + value
The next sentence is for *mobile* only:
```gherkin
When I pull "/storage/emulated/0/DCIM/logo.png" to "some/path"
```

## `refresh`

### refresh + page or currentPage or url
```gherkin
When I refresh the page
  and I refresh the current page
  and I reload the page
  and I reload the current page
```

## `remove`

### remove + app + value

*Same as uninstall*

The next sentence is for *mobile* only:
```gherkin
When I remove the app "com.example.android.myapp"
```

## `resize`

### resize + window + value + value
```gherkin
When I resize the window to 600, 400
```

## `rightClick`

### rightClick + target
```gherkin
When I right click {Foo}
  and I right click <#bar>
```

### rightClick + value
```gherkin
When I right click "Foo"
```

## `run`

### run + command

*Run command in the console/terminal*

👉 *Commands should be declared between single quotes (`'`) and must stay in a single line*

The next sentence is for [Test Events](language.md#test-events) only:
```gherkin
When I run the command 'rmdir foo'
  and I run the command './script.sh'
```

### run + script

*Run SQL commands in a database*

The next sentence is for [Test Events](language.md#test-events) only:
```gherkin
When I run the script 'INSERT INTO [MyDB].product ( name, price ) VALUES ( "Soda", 1.50 )'
  and I run the script 'INSERT INTO [MyDB].Users( UserName, UserSex, UserAge ) VALUES ( "Newton", "Male", 25 )'
  and I run the script 'INSERT INTO [MyDB].`my long table name`( 'long column`, `another long column`) VALUES ("Foo", 10)'
```

```gherkin
When I run the script 'UPDATE [MyDB].Users SET UserAge=26, UserStatus="online" WHERE UserName="Newton"'
  and I run the script 'UPDATE [MyDB].`my long table name` SET `long column` = "Bar" WHERE `another long column` = 70'
```

```gherkin
When I run the script 'DELETE FROM [MyDB].Users WHERE UserName="Newton"'
  and I run the script 'DELETE FROM [MyDB].`my long table name` WHERE `another long column` = 70'
```

👉 *Scripts should be declared between single quotes (`'`) and must stay in a single line*

👉 *Always include the reference to the database*

👉 *SQL commands may depend on the used database*

Concordia uses [database-js](https://github.com/mlaanderson/database-js) to access databases and files through a SQL-based interface. The supported SQL syntax may vary from one database to another. In case of problems, please see the [documentation of the corresponding driver](https://github.com/mlaanderson/database-js#drivers).

#### MySQL, PostgreSQL, and ADO databases

Normal syntax, like the aforementioned. Access through ADO currently works only on Windows.

#### JSON and CSV databases

- INSERT accepts only JSON objects or arrays as values
  - Example:
    ```gherkin
    When I run the script 'INSERT INTO [MyDB] VALUES { "name": "Mary", "surname": "Jane", "age": 21 }'
    ```

#### Excel and Firebase databases

Syntax similar to [JSON and CSV databases](#json-and-csv-databases). However, it has some limitations, as pointed out in [its documentation](https://github.com/mlaanderson/database-js-firebase) :

> *SQL commands are limited to SELECT, UPDATE, INSERT and DELETE. WHERE works well. JOINs are not allowed. GROUP BY is not supported. LIMIT and OFFSET are combined into a single LIMIT syntax: LIMIT [offset,]number*

#### INI databases

- INSERT
  - Not supported yet by [database-js-ini](https://github.com/mlaanderson/database-js-ini)

- DELETE
  - Not supported yet by [database-js-ini](https://github.com/mlaanderson/database-js-ini)

- UPDATE
  - Example:
    ```gherkin
    When I run the script 'UPDATE [MyDB] SET age = 22 WHERE name = "Mary"'
    ```

#### SQLite databases

Currently [database-js-sqlite](https://github.com/mlaanderson/database-js-sqlite) uses [sql.js](https://github.com/kripken/sql.js) that **doesn't persist the changes made to the database**.


## `saveScreenshot`

```gherkin
When I save a screenshot to "foo.png"
  and I take a photo to "bar.png"
```

## `scrollTo`

```gherkin
When I scroll to <#foo>
  and I scroll to {Bar}
```

## `see`

### see + value
```gherkin
Then I see "Foo Bar"
```

### see + not + value
```gherkin
Then I do not see "foo"
  and I don't see "bar"
```

### see + app + value + installed
The next sentence is for *mobile* only:
```gherkin
Then I see that the app "com.example.android.myapp" is installed
```

### see + app + value + not + installed
The next sentence is for *mobile* only:
```gherkin
Then I see that the app "com.example.android.myapp" is not installed
```

### see + currentActivity + value
The next sentence is for *mobile* only:
```gherkin
Then I see that the current activity is ".HomeScreenActivity"
```

### see + device + locked
The next sentence is for *mobile* only:
```gherkin
Then I see that the device is locked
```

### see + device + unlocked
The next sentence is for *mobile* only:
```gherkin
Then I see that the device is unlocked
```

### see + value + inside + target
```gherkin
Then I see "hello" in {foo}
  and I see "world" in <bar>
```

### see + value + not + inside + target
```gherkin
Then I don't see "hello" in {foo}
  and I don't see "world" in <bar>
```

### see + target + with + value
```gherkin
Then I see "hello" in {foo}
  and I see "world" in <bar>
```

### see + not + target + with + value
```gherkin
Then I do not see {Foo} with "hello"
  and I don't see <bar> with "world"
```

### see + not + value
```gherkin
Then I do not see "Foo Bar"
  and I don't see "Foo"
```

### see + target + checked
```gherkin
Then I see {Foo} is checked
  and I see <#bar> is checked
```

### see + not + target + checked
```gherkin
Then I do not see {Foo} is checked
  and I don't see <#bar> is checked
```

### see + cookie + value
```gherkin
Then I see the cookie "foo"
```

### see + not + cookie + value
```gherkin
Then I do not see the cookie "foo"
  and I don't see the cookie "bar"
```

### see + url + value
```gherkin
Then I see the url "/foo"
```

### see + not + url + value
```gherkin
Then I do not see the url "/foo"
  and I don't see the url "/bar"
```

### see + value + inside + title
```gherkin
Then I see "foo" in the title
```

### see + not + value + inside + title
```gherkin
Then I do not see "foo" in the title
  and I don't see "bar" in the title
```

### see + title + with + value
```gherkin
Then I see the title with "foo"
```

### see + not + title + with + value
```gherkin
Then I do not see the title with "foo"
  and I don't see the title with "bar"
```

### see + target
```gherkin
Then I see {Foo}
  and I see <#bar>
```

### see + not + target
```gherkin
Then I do not see {Foo}
  and I don't see <#bar>
```

### see + target + checked
```gherkin
Then I see {Foo} is checked
  and I see <#bar> is checked
```

### see + not + target + checked
```gherkin
Then I do not see {Foo} is checked
  and I don't see <#bar> is checked
```

### see + orientation + landscape
The next sentence is for *mobile* only:
```gherkin
Then I see that the orientation is landscape
```

### see + orientation + portrait
The next sentence is for *mobile* only:
```gherkin
Then I see that the orientation is portrait
```

### see + text + value
```gherkin
Then I see the text "foo"
  and I see the text 1000
```

### see + url + value
```gherkin
Then I see the url "/foo"
```

### see + target + enabled
```gherkin
Then I see {Foo} is enabled
  and I see <#bar> is enabled
```

## `select`

### select + value + inside + target
```gherkin
When I select "foo" in {Foo}
  and I select "bar" in <#bar>
```

## `shake`

### shake + device
The next sentence is for *mobile* only:
```gherkin
When I shake the device
  and I shake the phone
  and I shake the tablet
```

## `swipe`

### swipe + value + number + number
The next sentence is for *mobile* only:
```gherkin
When I swipe <#io.selendroid.myapp:id/LinearLayout1> to 100, 200
```

### swipe + value + down
The next sentence is for *mobile* only:
```gherkin
When I swipe <#io.selendroid.myapp:id/LinearLayout1> down
```

### swipe + value + left
The next sentence is for *mobile* only:
```gherkin
When I swipe <#io.selendroid.myapp:id/LinearLayout1> left
```

### swipe + value + right
The next sentence is for *mobile* only:
```gherkin
When I swipe <#io.selendroid.myapp:id/LinearLayout1> right
```

### swipe + value + up
The next sentence is for *mobile* only:
```gherkin
When I swipe <#io.selendroid.myapp:id/LinearLayout1> up
```

### swipe + from .. to
The next sentence is for *mobile* only:
```gherkin
When I swipe <#foo> to <#bar>
```

## `switch`

### switch + native
The next sentence is for *mobile* only:
```gherkin
When I switch to native
```

### switch + web
The next sentence is for *mobile* only:
```gherkin
When I switch to web
```

### switch + tab
```gherkin
When I switch to the tab 3
```

### switch + next + tab
```gherkin
When I switch to the next tab
```

### switch + previous + tab
```gherkin
When I switch to the previous tab
```

## `tap`

### tap + target
The next sentence is for *mobile* only:
```gherkin
When I tap <~ok>
  and I tap {Confirm}
```

## `uncheck`

### uncheck + target
```gherkin
When I unckeck {Foo}
  and I uncheck <#bar>
```

### uncheck + target + target
```gherkin
When I unckeck {Foo} in <#bar>
```

## `wait`

### wait + seconds
```gherkin
When I wait 2 seconds
```

### wait + target
```gherkin
When I wait for {Foo}
  and I wait for <#bar>
```

### wait + seconds + target
```gherkin
When I wait 3 seconds for {Foo}
  and I wait 5 seconds for <#bar>
```

### wait + target + hide
```gherkin
When I wait {Foo} to hide
  and I wait <#bar> to hide
```

### wait + seconds + target + hide
```gherkin
When I wait 3 seconds for {Foo} to hide
  and I wait 5 seconds for <#bar> to hide
```

### wait + target + enabled
```gherkin
When I wait {Foo} to be enabled
  and I wait <#bar> to be enabled
```

### wait + seconds + target + enabled
```gherkin
When I wait 3 seconds for {Foo} to be enabled
  and I wait 5 seconds for <#bar> to be enabled
```

### wait + target + invisible
```gherkin
When I wait {Foo} is invisible
  and I wait <#bar> is invisible
```

### wait + seconds + target + invisible
```gherkin
When I wait 3 seconds {Foo} to be invisible
  and I wait 5 seconds <#bar> to be invisible
```

### wait + target + visible
```gherkin
When I wait {Foo} to be visible
  and I wait <#bar> to be visible
```

### wait + seconds + target + visible
```gherkin
When I wait 3 seconds for {Foo} to be visible
  and I wait 5 seconds for <#bar> to be visible
```

### wait + text + value
```gherkin
When I wait for the text "Foo"
```

### wait + seconds + text + value
```gherkin
When I wait 3 seconds for the text "Foo"
```

### wait + url + value
```gherkin
When I wait for the url "/foo"
```

### wait + seconds + url + value
```gherkin
When I wait 3 seconds for the url "/bar"
```

### wait + option value + value + target
```gherkin
When I wait for the value "foo" in <#bar>
```

### wait + seconds + option value + value + target
```gherkin
When I wait 5 seconds for the value "foo" in <#bar>
```