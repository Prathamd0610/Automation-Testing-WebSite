import { Wrench } from 'lucide-react';
import type { LearningTrack } from './learning';

/**
 * ──────────────────────────────────────────────────────────────────────────
 *  Selenium Real-World Playbook
 *  The advanced/expert track focused on the problems senior SDETs actually
 *  hit every day — dynamic locators, web tables, windows/tabs, file up/down-
 *  load, session reuse, shadow DOM, evidence capture, headless/CI and a
 *  "daily problems" FAQ. Every lesson uses two running examples:
 *    • google.com — a public site anyone can open.
 *    • "this platform" — the practice modules, which expose stable
 *      data-testid hooks.
 *  Imported by learning.ts and appended to the Selenium group.
 * ──────────────────────────────────────────────────────────────────────────
 */

const seleniumRealWorld: LearningTrack = {
  id: 'selenium-real-world',
  category: 'Selenium',
  title: 'Selenium Real-World Playbook',
  subtitle: 'The daily problems senior SDETs solve',
  description:
    'Beyond tutorials: the messy, real-world Selenium problems senior testers face every day — dynamic locators on live sites, web tables and pagination, windows and tabs, file upload/download verification, session reuse via cookies, shadow DOM and tricky widgets, evidence capture, and headless/CI execution. Every technique is shown on google.com and on this platform.',
  icon: Wrench,
  level: 'advanced',
  tags: ['selenium', 'real-world', 'tables', 'files', 'cookies', 'shadow-dom', 'ci'],
  lessons: [
    {
      id: 'real-world-locators',
      title: 'Real-World Locator Strategies',
      level: 'intermediate',
      summary:
        'Write locators that survive dynamic DOMs, generated ids and frequent redesigns — using google.com and this platform as live targets.',
      duration: 16,
      practice: ['dynamic-ids', 'search-filter', 'tables'],
      objectives: [
        'Build stable XPath/CSS for dynamic, generated DOMs',
        'Locate by text, partial attribute and relationships',
        'Recognise and avoid brittle locator anti-patterns',
      ],
      blocks: [
        { kind: 'heading', text: 'The daily problem: the DOM keeps changing' },
        {
          kind: 'paragraph',
          text: 'On real apps like **google.com**, ids are auto-generated (`#APjFqb`), classes are minified (`.gLFyf`) and the layout changes weekly. Copy-pasted selectors from DevTools break constantly. Senior testers write locators around the **stable, meaning-bearing** parts of the DOM: roles, accessible names, visible text and stable attributes.',
        },
        { kind: 'heading', text: 'Example: the google.com search box' },
        {
          kind: 'paragraph',
          text: 'The class `gLFyf` is fragile. The `name="q"` attribute and the ARIA role are stable across redesigns:',
        },
        {
          kind: 'code',
          language: 'java',
          code: `// ❌ Brittle — minified class will change
driver.findElement(By.cssSelector("input.gLFyf"));

// ✅ Stable — the query field has been name="q" for ~20 years
driver.findElement(By.name("q"));

// ✅ Stable — by accessible role/label (Selenium 4 has no getByRole, use CSS)
driver.findElement(By.cssSelector("textarea[name='q'], input[name='q']"));

// Type a search and submit
WebElement box = driver.findElement(By.name("q"));
box.sendKeys("selenium webdriver");
box.sendKeys(Keys.ENTER);`,
        },
        { kind: 'heading', text: 'Attribute-contains for generated ids' },
        {
          kind: 'paragraph',
          text: 'When ids are partly generated (e.g. `user_4f3a_email`), match the **stable fragment** with CSS `^= $= *=` or XPath `contains()`. The **Dynamic IDs** practice module reproduces this exactly.',
        },
        {
          kind: 'code',
          language: 'java',
          code: `// CSS: starts-with / ends-with / contains an attribute value
driver.findElement(By.cssSelector("[id^='user_']"));      // starts with
driver.findElement(By.cssSelector("[id$='_email']"));     // ends with
driver.findElement(By.cssSelector("[id*='email']"));      // contains

// XPath equivalent
driver.findElement(By.xpath("//input[contains(@id,'email')]"));

// Best of all on this platform — a stable test hook:
driver.findElement(By.cssSelector("[data-testid='login-email']"));`,
        },
        { kind: 'heading', text: 'Locate by text and by relationship' },
        {
          kind: 'code',
          language: 'java',
          code: `// By exact / normalised visible text
driver.findElement(By.xpath("//button[normalize-space()='Sign in']"));

// The input that follows a given label
driver.findElement(By.xpath("//label[normalize-space()='Email']/following-sibling::input"));

// A button inside the row that contains 'Alice' (table actions)
driver.findElement(By.xpath("//tr[td[normalize-space()='Alice']]//button[@aria-label='Edit']"));

// Selenium 4 relative locators — the field below the Email field
WebElement email = driver.findElement(By.name("email"));
WebElement pwd = driver.findElement(with(By.tagName("input")).below(email));`,
        },
        {
          kind: 'callout',
          tone: 'warning',
          title: 'Never trust DevTools "Copy XPath"',
          text: 'Absolute paths like `/html/body/div[2]/div[3]/...` shatter on the smallest layout change. Always rewrite them as short, attribute- or text-based relative locators.',
        },
        {
          kind: 'callout',
          tone: 'tip',
          title: 'Add data-testid where you can',
          text: 'If you own the app (like this platform), ask developers to add `data-testid` to interactive elements. One stable hook eliminates a whole class of flaky locators.',
        },
      ],
    },
    {
      id: 'web-tables',
      title: 'Web Tables, Pagination & Dynamic Data',
      summary:
        'Extract, search, sort and validate data in real tables that paginate, lazy-load and re-render.',
      duration: 16,
      practice: ['tables', 'pagination', 'search-filter', 'infinite-scroll'],
      objectives: [
        'Read a cell by row/column intersection',
        'Iterate all rows and handle pagination',
        'Validate sorting, filtering and totals',
      ],
      blocks: [
        { kind: 'heading', text: 'The daily problem: data lives in tables' },
        {
          kind: 'paragraph',
          text: 'Admin panels, banking statements and CRMs are full of tables. Senior testers must read a specific cell, assert a row exists, validate sort order and walk every page. The **Tables**, **Pagination** and **Search & Filter** practice modules on this platform model all of these.',
        },
        { kind: 'heading', text: 'Read a cell by the row that contains a key' },
        {
          kind: 'code',
          language: 'java',
          code: `// Find the 'Email' cell in the row whose Name column is 'Alice'
String email = driver.findElement(By.xpath(
    "//table//tr[td[normalize-space()='Alice']]/td[3]"
)).getText();
Assert.assertEquals(email, "alice@example.com");

// Click the Edit button in that same row
driver.findElement(By.xpath(
    "//tr[td[normalize-space()='Alice']]//button[@aria-label='Edit']"
)).click();`,
        },
        { kind: 'heading', text: 'Iterate every row' },
        {
          kind: 'code',
          language: 'java',
          code: `List<WebElement> rows = driver.findElements(By.cssSelector("table tbody tr"));
for (WebElement row : rows) {
    List<WebElement> cells = row.findElements(By.tagName("td"));
    String name = cells.get(0).getText();
    String role = cells.get(1).getText();
    System.out.println(name + " -> " + role);
}`,
        },
        { kind: 'heading', text: 'Walk through pagination' },
        {
          kind: 'code',
          language: 'java',
          code: `boolean found = false;
while (true) {
    if (!driver.findElements(By.xpath("//td[normalize-space()='Target User']")).isEmpty()) {
        found = true;
        break;
    }
    List<WebElement> next = driver.findElements(By.cssSelector("[data-testid='page-next']:not([disabled])"));
    if (next.isEmpty()) break;        // last page reached
    next.get(0).click();
    // wait for the table to re-render before checking again
    new WebDriverWait(driver, Duration.ofSeconds(10)).until(
        ExpectedConditions.stalenessOf(driver.findElement(By.cssSelector("table tbody tr"))));
}
Assert.assertTrue(found, "User not found on any page");`,
        },
        { kind: 'heading', text: 'Validate sorting' },
        {
          kind: 'code',
          language: 'java',
          code: `driver.findElement(By.cssSelector("[data-testid='sort-amount']")).click();
List<WebElement> cells = driver.findElements(By.cssSelector("td.amount"));
List<Double> actual = cells.stream()
    .map(c -> Double.parseDouble(c.getText().replace("$", "")))
    .collect(Collectors.toList());
List<Double> expected = new ArrayList<>(actual);
Collections.sort(expected);
Assert.assertEquals(actual, expected, "Column is not sorted ascending");`,
        },
        {
          kind: 'callout',
          tone: 'warning',
          title: 'Re-query after a re-render',
          text: 'After clicking next/sort/filter, the old row elements go **stale**. Re-find the rows (or wait for staleness of the first row) instead of reusing a stored list.',
        },
        {
          kind: 'callout',
          tone: 'tip',
          title: 'Infinite scroll needs scrolling, not paging',
          text: 'For lazy lists (the Infinite Scroll module), scroll the last item into view with `((JavascriptExecutor) driver).executeScript("arguments[0].scrollIntoView()", lastRow)` and wait for the count to grow.',
        },
      ],
    },
    {
      id: 'windows-tabs',
      title: 'Windows, Tabs & Frames in the Wild',
      summary: 'Reliably switch between tabs, popups and iframes the way real apps open them.',
      duration: 14,
      practice: ['iframes', 'nested-frames', 'alerts'],
      objectives: [
        'Switch to a new tab opened by a link',
        'Handle iframes and nested frames',
        'Return safely to the original context',
      ],
      blocks: [
        { kind: 'heading', text: 'The daily problem: a click opens a new tab' },
        {
          kind: 'paragraph',
          text: 'On **google.com**, clicking a result with `target="_blank"`, or the "Privacy" / "Terms" links in the footer, opens a **new tab**. Selenium does not follow it automatically — you must switch handles.',
        },
        {
          kind: 'code',
          language: 'java',
          code: `String original = driver.getWindowHandle();
Set<String> before = driver.getWindowHandles();

// Click something that opens a new tab (e.g. google.com footer "Terms")
driver.findElement(By.linkText("Terms")).click();

// Wait for the new handle to appear, then switch
new WebDriverWait(driver, Duration.ofSeconds(10))
    .until(d -> d.getWindowHandles().size() > before.size());

for (String handle : driver.getWindowHandles()) {
    if (!handle.equals(original)) {
        driver.switchTo().window(handle);
        break;
    }
}

System.out.println(driver.getTitle());   // the new tab's title
driver.close();                            // close the new tab
driver.switchTo().window(original);        // back to the first tab`,
        },
        { kind: 'heading', text: 'Selenium 4 newWindow — open a tab on purpose' },
        {
          kind: 'code',
          language: 'java',
          code: `driver.switchTo().newWindow(WindowType.TAB);
driver.get("https://www.google.com");
// ... work ...
driver.close();
driver.switchTo().window(original);`,
        },
        { kind: 'heading', text: 'iFrames: switch in, do work, switch out' },
        {
          kind: 'paragraph',
          text: 'Embedded payment widgets, ad units and rich editors live in `<iframe>`s. Elements inside are invisible until you switch into the frame. The **iFrames** and **Nested Frames** modules let you practise this.',
        },
        {
          kind: 'code',
          language: 'java',
          code: `// By element (most robust), by name/id, or by index
driver.switchTo().frame(driver.findElement(By.cssSelector("iframe[title='payment']")));
driver.findElement(By.id("card-number")).sendKeys("4242424242424242");
driver.switchTo().defaultContent();      // back to the top document

// Nested: go level by level
driver.switchTo().frame("outer");
driver.switchTo().frame("inner");
driver.findElement(By.id("deep")).click();
driver.switchTo().defaultContent();`,
        },
        {
          kind: 'callout',
          tone: 'warning',
          title: 'Always return to defaultContent()',
          text: 'Forgetting to switch back is a top cause of "NoSuchElement" after frame work — the driver is still scoped inside the iframe. Make returning part of your helper method.',
        },
        {
          kind: 'callout',
          tone: 'tip',
          title: 'Wrap it in the Page Object',
          text: 'Hide handle/frame bookkeeping inside a page method like `openTermsInNewTab()` so tests never juggle window handles directly.',
        },
      ],
    },
    {
      id: 'file-upload-download',
      title: 'File Upload & Download Verification',
      summary: 'Upload files without native dialogs and verify downloaded files end-to-end.',
      duration: 14,
      practice: ['file-upload'],
      objectives: [
        'Upload via sendKeys to the file input',
        'Configure a download directory',
        'Verify a downloaded file on disk',
      ],
      blocks: [
        { kind: 'heading', text: 'The daily problem: native OS dialogs' },
        {
          kind: 'paragraph',
          text: 'Selenium **cannot** drive the operating-system file picker. The trick every senior tester knows: send the absolute path straight to the hidden `<input type="file">` and skip the dialog entirely. The **File Upload** module practises this.',
        },
        {
          kind: 'code',
          language: 'java',
          code: `WebElement fileInput = driver.findElement(By.cssSelector("input[type='file']"));
fileInput.sendKeys("C:\\\\data\\\\resume.pdf");   // absolute path, no dialog

// Assert the app shows the chosen file name
new WebDriverWait(driver, Duration.ofSeconds(10)).until(
    ExpectedConditions.textToBePresentInElementLocated(
        By.cssSelector("[data-testid='file-name']"), "resume.pdf"));`,
        },
        {
          kind: 'callout',
          tone: 'note',
          title: 'If the input is hidden',
          text: 'Some UIs hide the real input behind a styled button. `sendKeys` still works on the hidden input — you do not need it to be visible, only present in the DOM.',
        },
        { kind: 'heading', text: 'Configure a download directory' },
        {
          kind: 'paragraph',
          text: 'To verify downloads, point Chrome at a known folder and disable the download prompt, so files land where your test can read them:',
        },
        {
          kind: 'code',
          language: 'java',
          code: `Map<String, Object> prefs = new HashMap<>();
prefs.put("download.default_directory", "C:\\\\downloads");
prefs.put("download.prompt_for_download", false);
prefs.put("plugins.always_open_pdf_externally", true);

ChromeOptions options = new ChromeOptions();
options.setExperimentalOption("prefs", prefs);
WebDriver driver = new ChromeDriver(options);`,
        },
        { kind: 'heading', text: 'Verify the download finished' },
        {
          kind: 'code',
          language: 'java',
          code: `driver.findElement(By.cssSelector("[data-testid='export-csv']")).click();

Path expected = Paths.get("C:\\\\downloads", "report.csv");
// Poll until the file exists and is no longer a .crdownload temp file
new WebDriverWait(driver, Duration.ofSeconds(30))
    .pollingEvery(Duration.ofMillis(500))
    .until(d -> Files.exists(expected) &&
                !Files.exists(Paths.get(expected + ".crdownload")));

Assert.assertTrue(Files.size(expected) > 0, "Downloaded file is empty");`,
        },
        {
          kind: 'callout',
          tone: 'warning',
          title: 'Clean the folder before each test',
          text: 'Stale files from a previous run cause false passes. Delete the target file (or use a unique temp dir) in `@BeforeMethod` so each test verifies a fresh download.',
        },
        {
          kind: 'callout',
          tone: 'tip',
          title: 'Headless downloads need extra flags',
          text: 'Older headless Chrome blocked downloads. On modern `--headless=new` they work, but in CI also set a writable `download.default_directory` and ensure the path exists.',
        },
      ],
    },
    {
      id: 'cookies-session',
      title: 'Cookies, Sessions & Storage (Skip the Login)',
      summary: 'Reuse an authenticated session to make suites fast and stable — the senior speed trick.',
      duration: 13,
      practice: ['auth-demo'],
      objectives: [
        'Read, add and delete cookies',
        'Persist and restore a logged-in session',
        'Seed localStorage to skip UI login',
      ],
      blocks: [
        { kind: 'heading', text: 'The daily problem: logging in over and over' },
        {
          kind: 'paragraph',
          text: 'Logging in through the UI in every test is slow and a common flake source. The fix: log in **once**, capture the session cookies, and inject them before each test so it starts already authenticated. The **Auth Demo** module is perfect to practise on.',
        },
        { kind: 'heading', text: 'Read and add cookies' },
        {
          kind: 'code',
          language: 'java',
          code: `// Inspect cookies (e.g. google.com sets a consent cookie 'CONSENT')
driver.get("https://www.google.com");
for (Cookie c : driver.manage().getCookies()) {
    System.out.println(c.getName() + " = " + c.getValue());
}

// Add a cookie (must be on the right domain first)
driver.manage().addCookie(new Cookie("lang", "en-GB"));
driver.manage().deleteCookieNamed("lang");`,
        },
        { kind: 'heading', text: 'Save the session after one real login' },
        {
          kind: 'code',
          language: 'java',
          code: `// 1. Log in through the UI once
driver.get(BASE_URL + "/login");
driver.findElement(By.cssSelector("[data-testid='login-email']")).sendKeys("admin@example.com");
driver.findElement(By.cssSelector("[data-testid='login-password']")).sendKeys("secret");
driver.findElement(By.cssSelector("[data-testid='login-submit']")).click();
new WebDriverWait(driver, Duration.ofSeconds(10))
    .until(ExpectedConditions.urlContains("/dashboard"));

// 2. Persist all cookies to a file (Set<Cookie> is Serializable)
Set<Cookie> cookies = driver.manage().getCookies();
try (ObjectOutputStream out = new ObjectOutputStream(new FileOutputStream("session.ser"))) {
    out.writeObject(new ArrayList<>(cookies));
}`,
        },
        { kind: 'heading', text: 'Restore it in every later test' },
        {
          kind: 'code',
          language: 'java',
          code: `driver.get(BASE_URL);   // must be on the domain before adding cookies
try (ObjectInputStream in = new ObjectInputStream(new FileInputStream("session.ser"))) {
    @SuppressWarnings("unchecked")
    List<Cookie> cookies = (List<Cookie>) in.readObject();
    cookies.forEach(c -> driver.manage().addCookie(c));
}
driver.navigate().refresh();
driver.get(BASE_URL + "/dashboard");   // already logged in, no UI login`,
        },
        { kind: 'heading', text: 'Token apps: seed localStorage instead' },
        {
          kind: 'code',
          language: 'java',
          code: `JavascriptExecutor js = (JavascriptExecutor) driver;
driver.get(BASE_URL);
js.executeScript("window.localStorage.setItem('accessToken', arguments[0]);", token);
driver.navigate().refresh();`,
        },
        {
          kind: 'callout',
          tone: 'warning',
          title: 'Be on the domain before addCookie',
          text: 'Selenium can only set a cookie for the page currently loaded. Always `driver.get(domain)` first, then add cookies, then navigate to the protected page.',
        },
        {
          kind: 'callout',
          tone: 'tip',
          title: 'Even faster: log in via the API',
          text: 'Call the login API with REST Assured/HttpClient, grab the token, and inject it into localStorage or a cookie. This skips the UI entirely — the fastest, most stable setup.',
        },
      ],
    },
    {
      id: 'tricky-widgets',
      title: 'Shadow DOM, Autocomplete, Date Pickers & Sliders',
      summary: 'Tame the modern widgets that defeat naive locators and clicks.',
      duration: 15,
      practice: ['shadow-dom', 'autocomplete', 'date-picker', 'sliders', 'drag-drop'],
      objectives: [
        'Pierce open shadow DOM in Selenium 4',
        'Drive autocomplete, calendars and sliders',
        'Perform HTML5 drag-and-drop reliably',
      ],
      blocks: [
        { kind: 'heading', text: 'Shadow DOM: elements the DOM "hides"' },
        {
          kind: 'paragraph',
          text: 'Web components (and parts of real apps) put their internals inside a **shadow root**, invisible to ordinary `findElement`. Selenium 4 exposes `getShadowRoot()` to step inside. The **Shadow DOM** module reproduces this.',
        },
        {
          kind: 'code',
          language: 'java',
          code: `WebElement host = driver.findElement(By.cssSelector("custom-card"));
SearchContext shadow = host.getShadowRoot();
WebElement inner = shadow.findElement(By.cssSelector("[data-testid='shadow-content']"));
inner.click();

// Note: getShadowRoot() supports CSS only (no XPath) inside the shadow tree.`,
        },
        { kind: 'heading', text: 'Autocomplete: type, wait, pick' },
        {
          kind: 'code',
          language: 'java',
          code: `WebElement input = driver.findElement(By.cssSelector("[data-testid='autocomplete-input']"));
input.sendKeys("lon");
// Wait for suggestions to render, then click the one you want
new WebDriverWait(driver, Duration.ofSeconds(10)).until(
    ExpectedConditions.visibilityOfElementLocated(By.cssSelector("[role='option']")));
driver.findElement(By.xpath("//*[@role='option'][normalize-space()='London']")).click();`,
        },
        { kind: 'heading', text: 'Date pickers: prefer typing the value' },
        {
          kind: 'code',
          language: 'java',
          code: `// If it is a real <input type='date'>, just set the value
driver.findElement(By.cssSelector("input[type='date']")).sendKeys("2026-06-28");

// Calendar widget: open and click the day
driver.findElement(By.cssSelector("[data-testid='date-trigger']")).click();
driver.findElement(By.xpath("//button[normalize-space()='28']")).click();`,
        },
        { kind: 'heading', text: 'Sliders: nudge with arrow keys for determinism' },
        {
          kind: 'code',
          language: 'java',
          code: `WebElement slider = driver.findElement(By.cssSelector("[role='slider']"));
slider.sendKeys(Keys.HOME);                       // jump to min
for (int i = 0; i < 7; i++) slider.sendKeys(Keys.ARROW_RIGHT);
// Or drag it with the Actions API:
new Actions(driver).clickAndHold(slider).moveByOffset(60, 0).release().perform();`,
        },
        { kind: 'heading', text: 'HTML5 drag-and-drop' },
        {
          kind: 'code',
          language: 'java',
          code: `WebElement source = driver.findElement(By.cssSelector("[data-testid='drag-source']"));
WebElement target = driver.findElement(By.cssSelector("[data-testid='drop-target']"));

// Actions works for most; some HTML5 DnD needs a JS-based fallback
new Actions(driver).dragAndDrop(source, target).perform();`,
        },
        {
          kind: 'callout',
          tone: 'warning',
          title: 'Closed shadow roots are off-limits',
          text: '`getShadowRoot()` only works on **open** shadow DOM. Closed shadow roots are inaccessible by design — there is no Selenium workaround; you test via their public behaviour instead.',
        },
        {
          kind: 'callout',
          tone: 'tip',
          title: 'When Actions drag fails, use JS',
          text: 'Native HTML5 drag-and-drop sometimes ignores synthetic Actions events. A small JS helper that dispatches dragstart/drop events is a reliable fallback — keep one in your utilities.',
        },
      ],
    },
    {
      id: 'evidence-logs',
      title: 'Screenshots, Browser Logs & Evidence Capture',
      summary: 'Capture the proof you need to debug failures: screenshots, element shots, console and network logs.',
      duration: 13,
      practice: ['toasts', 'ajax'],
      objectives: [
        'Capture full-page and element screenshots',
        'Read browser console and performance logs',
        'Attach evidence on failure automatically',
      ],
      blocks: [
        { kind: 'heading', text: 'The daily problem: "it failed in CI, but works for me"' },
        {
          kind: 'paragraph',
          text: 'Headless CI failures are invisible unless you capture evidence. Senior testers screenshot on every failure and grab the browser console so a red build is debuggable without re-running.',
        },
        { kind: 'heading', text: 'Screenshots: page and element' },
        {
          kind: 'code',
          language: 'java',
          code: `// Whole viewport
File shot = ((TakesScreenshot) driver).getScreenshotAs(OutputType.FILE);
Files.copy(shot.toPath(), Paths.get("target/screenshots/home.png"),
    StandardCopyOption.REPLACE_EXISTING);

// A single element (Selenium 4) — e.g. just google.com's logo
WebElement logo = driver.findElement(By.cssSelector("img[alt='Google']"));
File el = logo.getScreenshotAs(OutputType.FILE);`,
        },
        { kind: 'heading', text: 'Read the browser console log' },
        {
          kind: 'code',
          language: 'java',
          code: `ChromeOptions options = new ChromeOptions();
LoggingPreferences logs = new LoggingPreferences();
logs.enable(LogType.BROWSER, Level.ALL);
options.setCapability("goog:loggingPrefs", logs);
WebDriver driver = new ChromeDriver(options);

driver.get(BASE_URL + "/dashboard");
for (LogEntry entry : driver.manage().logs().get(LogType.BROWSER)) {
    if (entry.getLevel() == Level.SEVERE) {
        System.out.println("JS error: " + entry.getMessage());
    }
}`,
        },
        { kind: 'heading', text: 'Screenshot automatically on failure (TestNG)' },
        {
          kind: 'code',
          language: 'java',
          code: `public class ScreenshotListener implements ITestListener {
    @Override public void onTestFailure(ITestResult result) {
        Object instance = result.getInstance();
        WebDriver driver = ((BaseTest) instance).getDriver();
        File shot = ((TakesScreenshot) driver).getScreenshotAs(OutputType.FILE);
        try {
            Files.copy(shot.toPath(),
                Paths.get("target/screenshots", result.getName() + ".png"),
                StandardCopyOption.REPLACE_EXISTING);
        } catch (IOException ignored) {}
    }
}`,
        },
        {
          kind: 'callout',
          tone: 'tip',
          title: 'Capture network with CDP',
          text: 'For deeper evidence, use Selenium 4 DevTools (CDP) to record failed requests and response codes — covered in the Advanced Selenium track\u2019s DevTools lesson.',
        },
        {
          kind: 'callout',
          tone: 'note',
          title: 'Attach to your report',
          text: 'Wire the screenshot into Allure or Extent (`Allure.addAttachment(...)`) so the image shows up next to the failed step, not just on disk.',
        },
      ],
    },
    {
      id: 'browser-options-ci',
      title: 'Browser Options, Headless & CI Execution',
      summary: 'Configure Chrome/Firefox for fast, stable headless runs in Docker and CI pipelines.',
      duration: 14,
      practice: ['auth-demo'],
      objectives: [
        'Tune ChromeOptions for CI and headless',
        'Run against a Selenium Grid / RemoteWebDriver',
        'Stabilise runs in containers',
      ],
      blocks: [
        { kind: 'heading', text: 'The daily problem: works locally, breaks in CI' },
        {
          kind: 'paragraph',
          text: 'CI machines are headless, have no GPU and a tiny default window. Without the right flags, tests that pass on your laptop fail with "element not interactable" or random timeouts. A solid options profile fixes most of it.',
        },
        { kind: 'heading', text: 'A battle-tested ChromeOptions profile' },
        {
          kind: 'code',
          language: 'java',
          code: `ChromeOptions options = new ChromeOptions();
options.addArguments("--headless=new");          // modern headless
options.addArguments("--window-size=1920,1080");  // avoid tiny-viewport bugs
options.addArguments("--disable-gpu");
options.addArguments("--no-sandbox");             // required in many containers
options.addArguments("--disable-dev-shm-usage");  // avoid /dev/shm crashes in Docker
options.addArguments("--remote-allow-origins=*");
options.setPageLoadStrategy(PageLoadStrategy.NORMAL);

WebDriver driver = new ChromeDriver(options);
driver.manage().window().maximize();
driver.get("https://www.google.com");`,
        },
        { kind: 'heading', text: 'Run remotely against a Grid' },
        {
          kind: 'code',
          language: 'java',
          code: `ChromeOptions options = new ChromeOptions();
WebDriver driver = new RemoteWebDriver(
    new URL("http://localhost:4444/wd/hub"), options);
// Same test code — it now runs on a Grid node or a cloud (BrowserStack/SauceLabs).`,
        },
        { kind: 'heading', text: 'Headed vs headless toggle from config' },
        {
          kind: 'code',
          language: 'java',
          code: `if (Boolean.parseBoolean(System.getProperty("headless", "false"))) {
    options.addArguments("--headless=new", "--window-size=1920,1080");
}
// mvn test -Dheadless=true   → CI
// mvn test                   → local, watch the browser`,
        },
        {
          kind: 'callout',
          tone: 'warning',
          title: 'Pixel differences in headless',
          text: 'Fonts and rendering differ slightly headless vs headed, which breaks naive visual checks. Pin `--window-size`, generate visual baselines in the **same** headless container you compare in.',
        },
        {
          kind: 'callout',
          tone: 'tip',
          title: 'Dockerise the browser',
          text: 'The official `selenium/standalone-chrome` image gives every run an identical browser. Combine it with `--shm-size=2g` to avoid the classic Chrome crash in containers.',
        },
      ],
    },
    {
      id: 'senior-problems-faq',
      title: 'Senior Tester FAQ: Daily Problems & Fixes',
      summary: 'A rapid-fire reference for the exceptions and edge cases senior SDETs debug every week.',
      duration: 15,
      practice: ['stale-elements', 'spinners', 'random-elements', 'delayed-loading'],
      objectives: [
        'Diagnose the common Selenium exceptions fast',
        'Apply the right fix for each failure class',
        'Adopt habits that prevent flakiness',
      ],
      blocks: [
        { kind: 'heading', text: 'StaleElementReferenceException' },
        {
          kind: 'paragraph',
          text: '**Cause:** the element was re-rendered (React/Angular updates the DOM) after you found it. **Fix:** re-find the element right before use, or retry the action.',
        },
        {
          kind: 'code',
          language: 'java',
          code: `// Retry-on-stale helper
public void clickWithRetry(By locator) {
    for (int i = 0; i < 3; i++) {
        try { driver.findElement(locator).click(); return; }
        catch (StaleElementReferenceException e) { /* DOM changed, loop */ }
    }
    throw new RuntimeException("Element kept going stale: " + locator);
}`,
        },
        { kind: 'heading', text: 'ElementClickInterceptedException' },
        {
          kind: 'paragraph',
          text: '**Cause:** a sticky header, cookie banner or spinner covers the element. **Fix:** wait for the overlay to disappear, scroll the target into view, or close the banner — do **not** reach for a JS click first.',
        },
        {
          kind: 'code',
          language: 'java',
          code: `// Scroll into the centre, then click
WebElement btn = driver.findElement(By.cssSelector("[data-testid='btn-submit']"));
((JavascriptExecutor) driver).executeScript(
    "arguments[0].scrollIntoView({block:'center'})", btn);
new WebDriverWait(driver, Duration.ofSeconds(10))
    .until(ExpectedConditions.elementToBeClickable(btn)).click();`,
        },
        { kind: 'heading', text: 'ElementNotInteractableException' },
        {
          kind: 'paragraph',
          text: '**Cause:** the element is in the DOM but hidden, disabled, or zero-size (e.g. behind a closed accordion). **Fix:** wait for visibility/enabled, or open the parent container first.',
        },
        { kind: 'heading', text: 'NoSuchElementException after a frame/tab' },
        {
          kind: 'paragraph',
          text: '**Cause:** you are still scoped inside an iframe, or on the wrong window handle. **Fix:** `switchTo().defaultContent()` or switch back to the right handle before locating.',
        },
        { kind: 'heading', text: 'TimeoutException on slow AJAX' },
        {
          kind: 'paragraph',
          text: '**Cause:** content loads after an XHR your wait does not account for. **Fix:** wait for the **specific** result element or for the spinner to become invisible — not a fixed sleep.',
        },
        {
          kind: 'code',
          language: 'java',
          code: `WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(15));
// wait for the spinner to go away...
wait.until(ExpectedConditions.invisibilityOfElementLocated(By.cssSelector(".spinner")));
// ...then for the data to appear
wait.until(ExpectedConditions.visibilityOfElementLocated(By.cssSelector("[data-testid='result']")));`,
        },
        { kind: 'heading', text: 'The habits that prevent 90% of flakes' },
        {
          kind: 'list',
          ordered: true,
          items: [
            'Never use `Thread.sleep` — always wait for a **condition**.',
            'Prefer `data-testid` / stable attributes over CSS class or absolute XPath.',
            'Re-find elements after any navigation, sort, filter or re-render.',
            'Isolate tests — unique data per test, fresh session, no shared state.',
            'Capture a screenshot + console log on every failure.',
            'Keep explicit waits; set the implicit wait to 0 to avoid compounding.',
          ],
        },
        {
          kind: 'callout',
          tone: 'tip',
          title: 'Practise the failure modes on purpose',
          text: 'The **Stale Elements**, **Spinners**, **Random Elements** and **Delayed Loading** modules deliberately trigger these exceptions so you can rehearse the fix before it bites you in production.',
        },
        {
          kind: 'callout',
          tone: 'note',
          title: 'Compare with Playwright',
          text: 'Many of these exceptions simply do not occur in Playwright thanks to auto-waiting and lazy locators. If your suite fights these daily, the Playwright tracks show a calmer alternative.',
        },
      ],
    },
  ],
};

/** The Selenium real-world/expert track. */
export const seleniumRealWorldTracks: LearningTrack[] = [seleniumRealWorld];
