import type { LucideIcon } from 'lucide-react';
import { Chrome, ListChecks, Sprout, Layers3, Rocket } from 'lucide-react';
import { MODULES, type ModuleMeta, type Difficulty } from './modules';
import { seleniumRealWorldTracks } from './learning-selenium-realworld';
import { playwrightTracks } from './learning-playwright';

/**
 * ──────────────────────────────────────────────────────────────────────────
 *  Learning Modules — structured, step-by-step beginner courses.
 *  This is the single source of truth for the Learning experience and drives
 *  the catalog, track pages, lesson reader, sidebar and command palette.
 * ──────────────────────────────────────────────────────────────────────────
 *
 *  Authoring notes for `LessonBlock`:
 *  - `paragraph` and list `items` support a tiny inline syntax:
 *      **bold**  and  `inline code`.
 *  - `code` blocks are rendered verbatim in a monospace panel with a copy
 *    button; keep them runnable and copy-paste friendly.
 */

export type LessonBlock =
  | { kind: 'heading'; text: string }
  | { kind: 'paragraph'; text: string }
  | { kind: 'list'; ordered?: boolean; items: string[] }
  | { kind: 'code'; language: string; code: string }
  | { kind: 'callout'; tone: 'tip' | 'note' | 'warning'; title?: string; text: string };

export interface Lesson {
  id: string;
  title: string;
  summary: string;
  /** Estimated reading/practice time in minutes. */
  duration: number;
  /** Difficulty of this lesson. Falls back to the track level when omitted. */
  level?: Difficulty;
  objectives: string[];
  blocks: LessonBlock[];
  /** Module ids (from `MODULES`) to practise alongside this lesson. */
  practice?: string[];
}

/**
 * Top-level grouping for the Learning catalog. Tracks are segregated into
 * tool families so learners can pick a stack (Selenium vs Playwright) first,
 * then drill into beginner → expert tracks within it.
 */
export type LearningCategory = 'Selenium' | 'Playwright';

export interface LearningTrack {
  id: string;
  /** Tool family this track belongs to (drives catalog/sidebar segregation). */
  category: LearningCategory;
  title: string;
  subtitle: string;
  description: string;
  icon: LucideIcon;
  level: Difficulty;
  tags: string[];
  lessons: Lesson[];
}

/* ════════════════════════════════════════════════════════════════════════
   TRACK 1 — Selenium WebDriver with Java
   ════════════════════════════════════════════════════════════════════════ */

const seleniumJava: LearningTrack = {
  id: 'selenium-java',
  category: 'Selenium',
  title: 'Selenium WebDriver with Java',
  subtitle: 'Automate the browser from zero',
  description:
    'Start from absolute zero and learn to drive a real browser with Java and Selenium 4 — installation, locators, waits, real interactions and the Page Object Model.',
  icon: Chrome,
  level: 'beginner',
  tags: ['selenium', 'java', 'webdriver', 'locators', 'pom'],
  lessons: [
    {
      id: 'introduction',
      title: 'What is Selenium & Test Automation?',
      summary: 'Understand what Selenium is, why teams automate browsers, and how the pieces fit together.',
      duration: 8,
      objectives: [
        'Explain what Selenium WebDriver does',
        'Describe the role of the browser driver',
        'Know when automation is (and is not) worth it',
      ],
      blocks: [
        { kind: 'heading', text: 'Why automate the browser?' },
        {
          kind: 'paragraph',
          text: 'Manual testing means a person clicks through the app every release. It is slow, error-prone and boring to repeat. **Test automation** lets a program drive the browser exactly like a user — clicking buttons, typing into fields and checking results — in seconds, on every code change.',
        },
        {
          kind: 'paragraph',
          text: '**Selenium WebDriver** is the industry-standard library for automating real browsers (Chrome, Firefox, Edge, Safari). You write code in a language such as Java, and Selenium translates your commands into actions the browser performs.',
        },
        { kind: 'heading', text: 'How the pieces fit together' },
        {
          kind: 'list',
          ordered: true,
          items: [
            'Your **Java test code** calls Selenium methods like `driver.get(url)` or `element.click()`.',
            'Selenium sends those commands to a **browser driver** (e.g. `chromedriver`) using the W3C WebDriver protocol.',
            'The driver controls the **real browser**, performs the action, and returns the result back to your test.',
          ],
        },
        {
          kind: 'callout',
          tone: 'note',
          title: 'Selenium 4 is driver-managed',
          text: 'Since Selenium 4.6, **Selenium Manager** automatically downloads the correct driver for your browser. You no longer need to manually manage `chromedriver` versions in most setups.',
        },
        { kind: 'heading', text: 'What Selenium is good (and bad) at' },
        {
          kind: 'list',
          items: [
            '✅ Great for **end-to-end** UI flows: login, checkout, form submission.',
            '✅ Cross-browser regression testing.',
            '❌ Not ideal for testing pure APIs (use REST tools) or unit-level logic (use JUnit/TestNG directly).',
            '❌ Avoid automating *everything* — automate the high-value, repetitive paths first.',
          ],
        },
        { kind: 'heading', text: 'Your learning path' },
        {
          kind: 'paragraph',
          text: 'These courses are designed to be taken in order. Each one builds on the last and ends with you assembling a complete, production-grade framework.',
        },
        {
          kind: 'list',
          ordered: true,
          items: [
            '**Selenium WebDriver with Java** — drive the browser: locators, waits, interactions, Page Object Model.',
            '**TestNG** — turn scripts into a structured, data-driven, parallel test suite.',
            '**Cucumber BDD** — describe behaviour in plain-English Gherkin backed by Selenium.',
            '**Build a Selenium Java Framework** — the capstone that combines Maven, Selenium, TestNG, Cucumber, logging, reporting and CI into one real framework.',
          ],
        },
        {
          kind: 'callout',
          tone: 'tip',
          title: 'Practice as you learn',
          text: 'This site has a **Practice Modules** section full of real buttons, dropdowns, tables and alerts with stable `data-testid` hooks. Use them to try every concept from these lessons.',
        },
      ],
    },
    {
      id: 'environment-setup',
      title: 'Setting Up Java, Maven & Selenium',
      summary: 'Install the JDK, an IDE and Maven, then create a Selenium project with the right dependencies.',
      duration: 12,
      objectives: [
        'Install the JDK and verify it',
        'Create a Maven project',
        'Add Selenium and TestNG dependencies',
      ],
      blocks: [
        { kind: 'heading', text: 'Step 1 — Install the JDK' },
        {
          kind: 'paragraph',
          text: 'Selenium with Java needs a **Java Development Kit (JDK) 11 or newer**. Download a build from Adoptium (Temurin) or Oracle, install it, then confirm from a terminal:',
        },
        { kind: 'code', language: 'bash', code: 'java -version\n# openjdk version "17.0.10" 2024-...' },
        { kind: 'heading', text: 'Step 2 — Pick an IDE' },
        {
          kind: 'paragraph',
          text: 'Use **IntelliJ IDEA Community Edition** (recommended for beginners) or Eclipse. Both have excellent Maven and JUnit/TestNG integration and free editions.',
        },
        { kind: 'heading', text: 'Step 3 — Create a Maven project' },
        {
          kind: 'paragraph',
          text: 'Maven manages your dependencies and builds. Create a new Maven project in your IDE, then open `pom.xml`. This file declares which libraries your project uses.',
        },
        { kind: 'heading', text: 'Step 4 — Add dependencies' },
        {
          kind: 'paragraph',
          text: 'Add Selenium and TestNG inside the `<dependencies>` block of your `pom.xml`:',
        },
        {
          kind: 'code',
          language: 'xml',
          code: `<dependencies>
  <dependency>
    <groupId>org.seleniumhq.selenium</groupId>
    <artifactId>selenium-java</artifactId>
    <version>4.21.0</version>
  </dependency>
  <dependency>
    <groupId>org.testng</groupId>
    <artifactId>testng</artifactId>
    <version>7.10.2</version>
    <scope>test</scope>
  </dependency>
</dependencies>`,
        },
        {
          kind: 'callout',
          tone: 'tip',
          title: 'Let Maven download everything',
          text: 'After editing `pom.xml`, reload the Maven project (IntelliJ shows a small refresh icon). Maven downloads Selenium, TestNG and all transitive libraries into your local repository.',
        },
        {
          kind: 'callout',
          tone: 'warning',
          title: 'Driver binaries',
          text: 'With Selenium 4.6+ you usually do **not** add WebDriverManager or download `chromedriver` manually — Selenium Manager handles it. Only add WebDriverManager if you are on an older Selenium version.',
        },
      ],
    },
    {
      id: 'first-test',
      title: 'Your First Selenium Test',
      summary: 'Write, run and understand a complete Selenium test that opens a page and asserts the title.',
      duration: 10,
      objectives: [
        'Launch and quit a browser from code',
        'Open a URL and read the page title',
        'Understand the basic test lifecycle',
      ],
      practice: ['buttons', 'inputs'],
      blocks: [
        { kind: 'heading', text: 'A complete first test' },
        {
          kind: 'paragraph',
          text: 'Create a class `FirstTest.java`. This test launches Chrome, navigates to a page, prints the title and closes the browser.',
        },
        {
          kind: 'code',
          language: 'java',
          code: `import org.openqa.selenium.WebDriver;
import org.openqa.selenium.chrome.ChromeDriver;
import org.testng.Assert;
import org.testng.annotations.Test;

public class FirstTest {

    @Test
    public void openHomePage() {
        // 1. Start the browser
        WebDriver driver = new ChromeDriver();

        try {
            // 2. Navigate to a page
            driver.get("https://example.com");

            // 3. Read and verify the title
            String title = driver.getTitle();
            System.out.println("Page title: " + title);
            Assert.assertEquals(title, "Example Domain");
        } finally {
            // 4. Always close the browser
            driver.quit();
        }
    }
}`,
        },
        { kind: 'heading', text: 'What each line does' },
        {
          kind: 'list',
          ordered: true,
          items: [
            '`new ChromeDriver()` launches a fresh Chrome window controlled by Selenium.',
            '`driver.get(url)` loads the page and waits for it to finish loading.',
            '`driver.getTitle()` returns the `<title>` text so you can assert on it.',
            '`driver.quit()` closes **all** browser windows and ends the driver session.',
          ],
        },
        {
          kind: 'callout',
          tone: 'warning',
          title: 'quit() vs close()',
          text: 'Use `driver.quit()` to fully end the session and free resources. `driver.close()` only closes the **current** window — the driver process can leak if you forget to quit.',
        },
        {
          kind: 'callout',
          tone: 'tip',
          title: 'Run it',
          text: 'Right-click the test method in your IDE and choose **Run**. A Chrome window flashes open, loads the page, and the test passes green in the Run panel.',
        },
      ],
    },
    {
      id: 'locators',
      title: 'Locators: Finding Elements',
      summary: 'Master the eight Selenium locator strategies and learn which to prefer for stable tests.',
      duration: 14,
      objectives: [
        'Use By.id, By.name, By.cssSelector and By.xpath',
        'Write robust CSS and XPath expressions',
        'Choose stable locators that resist UI changes',
      ],
      practice: ['inputs', 'buttons', 'dropdowns'],
      blocks: [
        { kind: 'heading', text: 'The By class' },
        {
          kind: 'paragraph',
          text: 'Before you can click or type, you must **locate** the element. Selenium uses the `By` class with `driver.findElement(By...)` (one element) or `driver.findElements(By...)` (a list).',
        },
        {
          kind: 'code',
          language: 'java',
          code: `import org.openqa.selenium.By;
import org.openqa.selenium.WebElement;

WebElement byId      = driver.findElement(By.id("email"));
WebElement byName    = driver.findElement(By.name("password"));
WebElement byCss     = driver.findElement(By.cssSelector("[data-testid='btn-click']"));
WebElement byXpath   = driver.findElement(By.xpath("//button[text()='Submit']"));
WebElement byLink    = driver.findElement(By.linkText("Dashboard"));`,
        },
        { kind: 'heading', text: 'The eight strategies' },
        {
          kind: 'list',
          items: [
            '`By.id` — fastest and most stable when ids are unique.',
            '`By.name` — common on form fields.',
            '`By.className` — single class name only.',
            '`By.tagName` — e.g. all `input` elements.',
            '`By.linkText` / `By.partialLinkText` — for anchor text.',
            '`By.cssSelector` — powerful, fast, readable. **Preferred** for most cases.',
            '`By.xpath` — most flexible; can traverse up/down the DOM and match by text.',
          ],
        },
        { kind: 'heading', text: 'CSS selector cheat sheet' },
        {
          kind: 'code',
          language: 'css',
          code: `#email                       /* id */
.btn-primary                 /* class */
input[type='email']          /* attribute */
[data-testid='btn-click']    /* custom test hook */
ul > li:first-child          /* direct child + position */
form .field input            /* descendant */`,
        },
        {
          kind: 'callout',
          tone: 'tip',
          title: 'Prefer data-testid',
          text: 'Designers and developers change classes and layout often, which breaks brittle selectors. A dedicated `data-testid` attribute is stable on purpose — this practice site adds them to every control.',
        },
        { kind: 'heading', text: 'Real-life example: locating on google.com' },
        {
          kind: 'paragraph',
          text: 'Open **google.com** and inspect the search box. Its class (`gLFyf`) is minified and changes between releases, but `name="q"` has been stable for years. This is exactly the judgement call you make on every real site — anchor on the **stable** attribute, not the pretty one.',
        },
        {
          kind: 'code',
          language: 'java',
          code: `// ❌ Brittle: minified class breaks on the next Google redesign
driver.findElement(By.cssSelector("input.gLFyf"));

// ✅ Stable: the search field's name attribute rarely changes
WebElement search = driver.findElement(By.name("q"));
search.sendKeys("selenium webdriver");
search.sendKeys(Keys.ENTER);`,
        },
        { kind: 'heading', text: 'XPath when you need text or axes' },
        {
          kind: 'code',
          language: 'java',
          code: `// Match by visible text
driver.findElement(By.xpath("//button[normalize-space()='Add to cart']"));

// Find a row by its cell text, then a button inside it
driver.findElement(By.xpath("//tr[td[text()='Alice']]//button[@aria-label='Edit']"));`,
        },
        {
          kind: 'callout',
          tone: 'warning',
          title: 'Avoid absolute XPath',
          text: 'Never use copy-pasted absolute paths like `/html/body/div[2]/div/...`. They shatter the moment the layout shifts. Prefer short, attribute- or text-based relative XPath.',
        },
      ],
    },
    {
      id: 'interactions',
      title: 'Interacting With Elements',
      summary: 'Click, type, read text, and inspect element state with the core WebElement methods.',
      duration: 11,
      objectives: [
        'Use click(), sendKeys() and clear()',
        'Read text and attributes',
        'Check visibility and enabled state',
      ],
      practice: ['inputs', 'buttons', 'checkboxes', 'radios', 'keyboard', 'mouse-actions'],
      blocks: [
        { kind: 'heading', text: 'The everyday methods' },
        {
          kind: 'code',
          language: 'java',
          code: `WebElement email = driver.findElement(By.id("email"));
email.clear();                       // empty the field first
email.sendKeys("user@example.com");  // type text

WebElement submit = driver.findElement(By.cssSelector("[data-testid='btn-submit']"));
submit.click();                      // click the button

String heading = driver.findElement(By.tagName("h1")).getText();
String value   = email.getAttribute("value");
boolean shown  = submit.isDisplayed();
boolean usable = submit.isEnabled();`,
        },
        { kind: 'heading', text: 'Reading state' },
        {
          kind: 'list',
          items: [
            '`getText()` returns the **visible** text of an element.',
            '`getAttribute("value")` reads the current value of an input (which `getText()` does not).',
            '`isDisplayed()`, `isEnabled()`, `isSelected()` return booleans for assertions.',
          ],
        },
        {
          kind: 'callout',
          tone: 'note',
          title: 'sendKeys with special keys',
          text: 'Use the `Keys` enum for non-text keys, e.g. `email.sendKeys(Keys.ENTER)` to submit, or `Keys.chord(Keys.CONTROL, "a")` to select all.',
        },
        { kind: 'heading', text: 'Real-life example: a google.com search' },
        {
          kind: 'paragraph',
          text: 'These same methods drive any site. On **google.com**, typing a query and pressing Enter is just `sendKeys` plus a key press — the bread-and-butter of UI automation.',
        },
        {
          kind: 'code',
          language: 'java',
          code: `driver.get("https://www.google.com");
WebElement box = driver.findElement(By.name("q"));
box.clear();
box.sendKeys("selenium webdriver tutorial");
box.sendKeys(Keys.ENTER);

// Read the result stats text the page shows after searching
String stats = driver.findElement(By.id("result-stats")).getText();
System.out.println(stats);   // e.g. "About 12,300,000 results"`,
        },
        { kind: 'heading', text: 'Try it on this site' },
        {
          kind: 'paragraph',
          text: 'Open the **Input Fields** and **Buttons** practice modules. Every control there exposes a `data-testid`, so you can write `By.cssSelector("[data-testid=\'...\']")` and immediately see your code work against a real page.',
        },
        {
          kind: 'callout',
          tone: 'warning',
          title: 'ElementNotInteractable',
          text: 'If a click throws `ElementNotInteractableException`, the element is hidden, disabled or covered by another element. Scroll it into view or wait for it to become clickable (next lesson).',
        },
      ],
    },
    {
      id: 'waits',
      title: 'Waits: Handling Timing',
      summary: 'Stop flaky tests by replacing Thread.sleep with implicit, explicit and fluent waits.',
      duration: 13,
      objectives: [
        'Explain why fixed sleeps are an anti-pattern',
        'Configure an implicit wait',
        'Use WebDriverWait with ExpectedConditions',
      ],
      practice: ['delayed-loading', 'spinners', 'ajax'],
      blocks: [
        { kind: 'heading', text: 'The #1 cause of flaky tests' },
        {
          kind: 'paragraph',
          text: 'Modern apps load content **asynchronously**. If your test looks for a button before it appears, it fails. The wrong fix is `Thread.sleep(5000)` — it is slow and still unreliable. The right fix is a **wait** that polls until a condition is met.',
        },
        { kind: 'heading', text: 'Implicit wait (global)' },
        {
          kind: 'paragraph',
          text: 'An implicit wait tells the driver to poll the DOM for up to N seconds whenever it cannot find an element. Set it **once**:',
        },
        {
          kind: 'code',
          language: 'java',
          code: `import java.time.Duration;

driver.manage().timeouts().implicitlyWait(Duration.ofSeconds(10));`,
        },
        { kind: 'heading', text: 'Explicit wait (recommended)' },
        {
          kind: 'paragraph',
          text: 'An explicit wait waits for a **specific condition** on a specific element. It is precise and the most reliable approach.',
        },
        {
          kind: 'code',
          language: 'java',
          code: `import org.openqa.selenium.support.ui.WebDriverWait;
import org.openqa.selenium.support.ui.ExpectedConditions;
import java.time.Duration;

WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(10));

WebElement btn = wait.until(
    ExpectedConditions.elementToBeClickable(By.cssSelector("[data-testid='btn-async']"))
);
btn.click();

wait.until(ExpectedConditions.visibilityOfElementLocated(By.id("result")));`,
        },
        { kind: 'heading', text: 'Useful ExpectedConditions' },
        {
          kind: 'list',
          items: [
            '`visibilityOfElementLocated` — element exists and is visible.',
            '`elementToBeClickable` — visible **and** enabled.',
            '`presenceOfElementLocated` — exists in DOM (may be hidden).',
            '`textToBePresentInElement` — wait for specific text.',
            '`invisibilityOfElementLocated` — wait for a spinner to disappear.',
          ],
        },
        { kind: 'heading', text: 'Fluent wait (fine-grained control)' },
        {
          kind: 'paragraph',
          text: 'A **Fluent wait** is an explicit wait where you control the polling interval and which exceptions to ignore — useful for awkward, slowly-appearing elements.',
        },
        {
          kind: 'code',
          language: 'java',
          code: `import org.openqa.selenium.support.ui.FluentWait;
import org.openqa.selenium.NoSuchElementException;
import java.time.Duration;

WebElement el = new FluentWait<>(driver)
    .withTimeout(Duration.ofSeconds(15))
    .pollingEvery(Duration.ofMillis(500))
    .ignoring(NoSuchElementException.class)
    .until(d -> d.findElement(By.id("late-element")));`,
        },
        { kind: 'heading', text: 'Real-life example: waiting on google.com results' },
        {
          kind: 'paragraph',
          text: 'After you submit a search on **google.com**, results render asynchronously. A fixed sleep is wasteful and flaky; an explicit wait for the results container is precise — it continues the instant the page is ready.',
        },
        {
          kind: 'code',
          language: 'java',
          code: `driver.get("https://www.google.com");
driver.findElement(By.name("q")).sendKeys("webdriver waits" + Keys.ENTER);

// Wait for the search results region, not a guessed number of seconds
new WebDriverWait(driver, Duration.ofSeconds(10)).until(
    ExpectedConditions.visibilityOfElementLocated(By.id("search")));

System.out.println("Results loaded: " + driver.getTitle());`,
        },
        {
          kind: 'callout',
          tone: 'warning',
          title: 'Do not mix implicit and explicit waits',
          text: 'Combining both can cause unpredictable, compounded wait times. Pick **explicit waits** for serious test suites and keep the implicit wait at 0.',
        },
        {
          kind: 'callout',
          tone: 'tip',
          title: 'Practice with delays',
          text: 'The **Delayed Loading**, **Spinners** and **AJAX Data** practice modules deliberately defer content so you can practise explicit waits in a controlled way.',
        },
      ],
    },
    {
      id: 'dropdowns-alerts-frames',
      title: 'Dropdowns, Alerts, Frames & Windows',
      level: 'intermediate',
      summary: 'Handle the tricky browser constructs: select menus, JavaScript alerts, iframes and new tabs.',
      duration: 12,
      objectives: [
        'Select options with the Select class',
        'Accept and dismiss native alerts',
        'Switch into iframes and between windows',
      ],
      practice: ['dropdowns', 'alerts', 'iframes', 'nested-frames'],
      blocks: [
        { kind: 'heading', text: 'Native <select> dropdowns' },
        {
          kind: 'code',
          language: 'java',
          code: `import org.openqa.selenium.support.ui.Select;

Select country = new Select(driver.findElement(By.id("country")));
country.selectByVisibleText("India");
country.selectByValue("IN");
country.selectByIndex(2);`,
        },
        {
          kind: 'callout',
          tone: 'note',
          title: 'Custom dropdowns are different',
          text: 'The `Select` class only works on real `<select>` tags. Custom React/Material dropdowns are `<div>`s — for those you click to open, then click the option element directly.',
        },
        { kind: 'heading', text: 'JavaScript alerts' },
        {
          kind: 'code',
          language: 'java',
          code: `import org.openqa.selenium.Alert;

driver.findElement(By.cssSelector("[data-testid='trigger-alert']")).click();
Alert alert = driver.switchTo().alert();
System.out.println(alert.getText());
alert.accept();   // OK   — use alert.dismiss() for Cancel
// For prompts: alert.sendKeys("hello"); alert.accept();`,
        },
        { kind: 'heading', text: 'iFrames' },
        {
          kind: 'paragraph',
          text: 'Elements inside an `<iframe>` are invisible to the driver until you switch into the frame.',
        },
        {
          kind: 'code',
          language: 'java',
          code: `driver.switchTo().frame("frame-name-or-id");
driver.findElement(By.id("inside-frame")).click();
driver.switchTo().defaultContent();   // back to the main page`,
        },
        { kind: 'heading', text: 'Windows & tabs' },
        {
          kind: 'code',
          language: 'java',
          code: `String original = driver.getWindowHandle();

for (String handle : driver.getWindowHandles()) {
    if (!handle.equals(original)) {
        driver.switchTo().window(handle);  // switch to the new tab
    }
}
// ... work in the new tab ...
driver.close();
driver.switchTo().window(original);`,
        },
        {
          kind: 'callout',
          tone: 'tip',
          title: 'Practice modules',
          text: 'Try the **Dropdowns & Selects**, **Alerts & Popups**, **iFrames** and **Nested Frames** modules to drill each of these techniques.',
        },
      ],
    },
    {
      id: 'page-object-model',
      title: 'The Page Object Model (POM)',
      level: 'intermediate',
      summary: 'Organize tests into maintainable page classes that hide locators behind readable methods.',
      duration: 14,
      objectives: [
        'Explain the benefits of POM',
        'Write a page class with @FindBy and PageFactory',
        'Refactor a script into clean, reusable tests',
      ],
      practice: ['auth-demo', 'wizard'],
      blocks: [
        { kind: 'heading', text: 'Why POM?' },
        {
          kind: 'paragraph',
          text: 'As your suite grows, copy-pasted locators become a maintenance nightmare — one UI change breaks dozens of tests. The **Page Object Model** puts the locators and actions for each page into its own class. Tests then read like plain English and locators live in exactly one place.',
        },
        { kind: 'heading', text: 'A login page object' },
        {
          kind: 'code',
          language: 'java',
          code: `import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.FindBy;
import org.openqa.selenium.support.PageFactory;

public class LoginPage {
    private final WebDriver driver;

    @FindBy(css = "[data-testid='login-email']")
    private WebElement email;

    @FindBy(css = "[data-testid='login-password']")
    private WebElement password;

    @FindBy(css = "[data-testid='login-submit']")
    private WebElement submit;

    public LoginPage(WebDriver driver) {
        this.driver = driver;
        PageFactory.initElements(driver, this);
    }

    public DashboardPage loginAs(String user, String pass) {
        email.clear();
        email.sendKeys(user);
        password.sendKeys(pass);
        submit.click();
        return new DashboardPage(driver);
    }
}`,
        },
        { kind: 'heading', text: 'The test becomes tiny' },
        {
          kind: 'code',
          language: 'java',
          code: `@Test
public void userCanLogIn() {
    driver.get(BASE_URL + "/login");
    DashboardPage dashboard = new LoginPage(driver)
        .loginAs("admin@example.com", "secret");

    Assert.assertTrue(dashboard.isLoaded());
}`,
        },
        {
          kind: 'callout',
          tone: 'tip',
          title: 'Return the next page',
          text: 'Notice `loginAs` returns a `DashboardPage`. Returning the resulting page object from each action creates a fluent, chainable API and models real navigation.',
        },
        {
          kind: 'list',
          items: [
            'One class per page or major component.',
            'Locators are `private` — tests never see raw selectors.',
            'Methods describe **user intent** (`loginAs`), not mechanics (`type`, `click`).',
            'No assertions inside page objects — keep those in the tests.',
          ],
        },
        {
          kind: 'callout',
          tone: 'note',
          title: 'Where to go next',
          text: 'You now know enough to automate real flows. Continue with the **TestNG** track to structure, group and data-drive your tests, then **Cucumber** to describe behaviour in plain English.',
        },
      ],
    },
  ],
};

/* ════════════════════════════════════════════════════════════════════════
   TRACK 2 — TestNG Framework
   ════════════════════════════════════════════════════════════════════════ */

const testng: LearningTrack = {
  id: 'testng',
  category: 'Selenium',
  title: 'TestNG Test Framework',
  subtitle: 'Structure, run and report your tests',
  description:
    'TestNG turns loose Selenium scripts into a real test framework — annotations, assertions, grouping, data-driven tests, parallel runs and rich reports.',
  icon: ListChecks,
  level: 'beginner',
  tags: ['testng', 'java', 'annotations', 'dataprovider', 'parallel'],
  lessons: [
    {
      id: 'introduction',
      title: 'Why TestNG?',
      summary: 'See what a test framework gives you over plain main() methods and why TestNG is a Selenium favourite.',
      duration: 7,
      objectives: [
        'Describe what TestNG adds to Selenium',
        'Compare TestNG with JUnit at a glance',
        'Understand tests, suites and reports',
      ],
      blocks: [
        { kind: 'heading', text: 'From scripts to a framework' },
        {
          kind: 'paragraph',
          text: 'A bare Selenium script in a `main` method runs once, top to bottom, with no setup/teardown structure, no reporting and no easy way to run many tests. **TestNG** (Test, the *Next Generation*) adds all of that: annotations, assertions, configuration, parallel execution and HTML reports.',
        },
        { kind: 'heading', text: 'What you get' },
        {
          kind: 'list',
          items: [
            'Clear **lifecycle** hooks (`@BeforeMethod`, `@AfterMethod`, …).',
            'Rich **assertions** that mark tests passed/failed automatically.',
            '**Grouping**, **priorities** and **dependencies** between tests.',
            '**Data-driven** testing with `@DataProvider`.',
            '**Parallel** execution and **suite** files (`testng.xml`).',
            'Built-in **HTML/XML reports** plus pluggable listeners.',
          ],
        },
        {
          kind: 'callout',
          tone: 'note',
          title: 'TestNG vs JUnit',
          text: 'Both are great. TestNG is popular in Selenium UI suites for its flexible suite files, built-in parallelism and powerful data providers. The concepts transfer directly to JUnit 5 if your team uses that instead.',
        },
      ],
    },
    {
      id: 'setup-first-test',
      title: 'Setup & Your First TestNG Test',
      summary: 'Add TestNG, write an @Test method and run it from the IDE and Maven.',
      duration: 9,
      objectives: ['Add the TestNG dependency', 'Write and run an @Test', 'Read the pass/fail result'],
      blocks: [
        { kind: 'heading', text: 'Dependency' },
        {
          kind: 'paragraph',
          text: 'If you followed the Selenium track your `pom.xml` already has TestNG. If not, add it:',
        },
        {
          kind: 'code',
          language: 'xml',
          code: `<dependency>
  <groupId>org.testng</groupId>
  <artifactId>testng</artifactId>
  <version>7.10.2</version>
  <scope>test</scope>
</dependency>`,
        },
        { kind: 'heading', text: 'A first test' },
        {
          kind: 'code',
          language: 'java',
          code: `import org.testng.Assert;
import org.testng.annotations.Test;

public class MathTest {

    @Test
    public void addsNumbers() {
        int sum = 2 + 3;
        Assert.assertEquals(sum, 5, "2 + 3 should be 5");
    }
}`,
        },
        {
          kind: 'paragraph',
          text: 'Any `public void` method marked `@Test` is a test. Run it by right-clicking in the IDE, or from the command line with Maven Surefire:',
        },
        { kind: 'code', language: 'bash', code: 'mvn test' },
        {
          kind: 'callout',
          tone: 'tip',
          title: 'Green and red',
          text: 'TestNG marks a test **failed** if an assertion fails or any unhandled exception is thrown — otherwise it **passes**. You never write `if/else` to decide the result.',
        },
      ],
    },
    {
      id: 'annotations',
      title: 'Annotations & Test Lifecycle',
      summary: 'Use @BeforeMethod, @AfterMethod and friends to set up and tear down cleanly.',
      duration: 12,
      objectives: [
        'List the main TestNG annotations in execution order',
        'Open the browser before each test and quit after',
        'Choose method vs class vs suite scope',
      ],
      blocks: [
        { kind: 'heading', text: 'The annotation family' },
        {
          kind: 'list',
          items: [
            '`@BeforeSuite` / `@AfterSuite` — once for the whole suite.',
            '`@BeforeClass` / `@AfterClass` — once per test class.',
            '`@BeforeMethod` / `@AfterMethod` — before/after **every** `@Test`.',
            '`@Test` — the actual test method.',
          ],
        },
        { kind: 'heading', text: 'Selenium setup/teardown' },
        {
          kind: 'code',
          language: 'java',
          code: `import org.openqa.selenium.WebDriver;
import org.openqa.selenium.chrome.ChromeDriver;
import org.testng.annotations.*;

public class BaseTest {
    protected WebDriver driver;

    @BeforeMethod
    public void setUp() {
        driver = new ChromeDriver();
        driver.manage().window().maximize();
    }

    @Test
    public void homePageLoads() {
        driver.get("https://example.com");
        // ... assertions ...
    }

    @AfterMethod
    public void tearDown() {
        if (driver != null) driver.quit();
    }
}`,
        },
        {
          kind: 'callout',
          tone: 'note',
          title: 'Execution order',
          text: 'For each `@Test`: `@BeforeMethod` runs, then the test, then `@AfterMethod`. A fresh browser per test keeps tests **independent** — a failure in one never pollutes another.',
        },
        {
          kind: 'callout',
          tone: 'tip',
          title: 'Share setup with a base class',
          text: 'Put `setUp`/`tearDown` in a `BaseTest` and have every test class extend it. This is the foundation of a clean Selenium + TestNG framework.',
        },
      ],
    },
    {
      id: 'assertions',
      title: 'Assertions: Hard & Soft',
      summary: 'Verify outcomes with assertEquals/assertTrue and collect multiple checks with SoftAssert.',
      duration: 9,
      objectives: ['Use the common Assert methods', 'Understand hard vs soft assertions', 'Add helpful failure messages'],
      blocks: [
        { kind: 'heading', text: 'Hard assertions' },
        {
          kind: 'paragraph',
          text: 'A **hard** assertion stops the test immediately on failure. Use `org.testng.Assert`:',
        },
        {
          kind: 'code',
          language: 'java',
          code: `Assert.assertEquals(actual, expected, "title mismatch");
Assert.assertTrue(button.isEnabled(), "button should be enabled");
Assert.assertFalse(errors.isDisplayed());
Assert.assertNotNull(token);`,
        },
        { kind: 'heading', text: 'Soft assertions' },
        {
          kind: 'paragraph',
          text: 'A **soft** assertion records the failure but lets the test continue, then reports all failures at the end when you call `assertAll()`. Great for validating many fields on one page.',
        },
        {
          kind: 'code',
          language: 'java',
          code: `import org.testng.asserts.SoftAssert;

SoftAssert soft = new SoftAssert();
soft.assertEquals(name.getText(), "Alice");
soft.assertEquals(role.getText(), "Admin");
soft.assertTrue(avatar.isDisplayed());
soft.assertAll();   // reports every failure collected above`,
        },
        {
          kind: 'callout',
          tone: 'warning',
          title: 'Always call assertAll()',
          text: 'If you forget `assertAll()`, soft-assertion failures are silently ignored and the test passes falsely. Put it at the very end of the test (or in `@AfterMethod`).',
        },
        {
          kind: 'callout',
          tone: 'tip',
          title: 'Add messages',
          text: 'The optional last argument is a failure message. Good messages turn a red test into an instantly understandable bug report.',
        },
      ],
    },
    {
      id: 'groups-priority-dependencies',
      title: 'Groups, Priority & Dependencies',
      summary: 'Control which tests run, in what order, and how failures cascade.',
      duration: 11,
      objectives: ['Order tests with priority', 'Tag tests into groups', 'Skip dependent tests on failure'],
      blocks: [
        { kind: 'heading', text: 'Priority' },
        {
          kind: 'paragraph',
          text: 'By default TestNG runs tests **alphabetically**, which is rarely what you want. Set `priority` (lower runs first):',
        },
        {
          kind: 'code',
          language: 'java',
          code: `@Test(priority = 1) public void openLoginPage() { }
@Test(priority = 2) public void submitCredentials() { }
@Test(priority = 3) public void seeDashboard() { }`,
        },
        { kind: 'heading', text: 'Groups' },
        {
          kind: 'code',
          language: 'java',
          code: `@Test(groups = {"smoke"})
public void criticalLoginWorks() { }

@Test(groups = {"regression"})
public void rareEdgeCase() { }`,
        },
        {
          kind: 'paragraph',
          text: 'Then run only a group from `testng.xml` — e.g. run `smoke` on every commit and the full `regression` suite nightly.',
        },
        { kind: 'heading', text: 'Dependencies' },
        {
          kind: 'code',
          language: 'java',
          code: `@Test
public void login() { /* ... */ }

@Test(dependsOnMethods = "login")
public void viewProfile() {
    // automatically SKIPPED if login() failed
}`,
        },
        {
          kind: 'callout',
          tone: 'note',
          title: 'Dependencies vs independence',
          text: 'Dependencies are handy for true prerequisites, but over-using them couples tests together. Prefer independent tests where practical so failures stay isolated.',
        },
      ],
    },
    {
      id: 'data-providers',
      title: 'Data-Driven Tests with @DataProvider',
      level: 'intermediate',
      summary: 'Run the same test over many inputs to get broad coverage with little code.',
      duration: 11,
      objectives: ['Create a @DataProvider', 'Feed multiple rows into one @Test', 'Understand parameterization options'],
      practice: ['tables', 'inputs'],
      blocks: [
        { kind: 'heading', text: 'One test, many inputs' },
        {
          kind: 'paragraph',
          text: 'A `@DataProvider` returns a 2-D array of arguments. TestNG runs the test once per row, injecting the values as method parameters.',
        },
        {
          kind: 'code',
          language: 'java',
          code: `import org.testng.annotations.DataProvider;
import org.testng.annotations.Test;
import org.testng.Assert;

public class LoginDataTest {

    @DataProvider(name = "credentials")
    public Object[][] credentials() {
        return new Object[][] {
            { "admin@example.com", "secret",  true  },
            { "user@example.com",  "wrong",   false },
            { "",                  "",        false },
        };
    }

    @Test(dataProvider = "credentials")
    public void login(String email, String password, boolean expectedSuccess) {
        boolean success = attemptLogin(email, password);
        Assert.assertEquals(success, expectedSuccess);
    }
}`,
        },
        {
          kind: 'callout',
          tone: 'tip',
          title: 'Externalize the data',
          text: 'For large data sets, read rows from a CSV, Excel or JSON file inside the provider so non-developers can add cases without touching code.',
        },
        {
          kind: 'callout',
          tone: 'note',
          title: 'Parameters from testng.xml',
          text: 'For a few simple values (like a base URL or browser name) you can also use `@Parameters` with `<parameter>` entries in `testng.xml` instead of a data provider.',
        },
      ],
    },
    {
      id: 'suites-parallel',
      title: 'Suites & Parallel Execution',
      level: 'intermediate',
      summary: 'Drive runs from testng.xml and cut execution time by running tests in parallel.',
      duration: 12,
      objectives: ['Write a testng.xml suite', 'Select classes/groups to run', 'Enable parallel threads safely'],
      blocks: [
        { kind: 'heading', text: 'The suite file' },
        {
          kind: 'paragraph',
          text: '`testng.xml` describes what to run. It groups classes into `<test>` blocks inside a `<suite>`.',
        },
        {
          kind: 'code',
          language: 'xml',
          code: `<!DOCTYPE suite SYSTEM "https://testng.org/testng-1.0.dtd">
<suite name="Regression" parallel="tests" thread-count="3">
  <test name="Auth">
    <classes>
      <class name="tests.LoginTest"/>
      <class name="tests.LogoutTest"/>
    </classes>
  </test>
  <test name="Catalog">
    <classes>
      <class name="tests.SearchTest"/>
    </classes>
  </test>
</suite>`,
        },
        { kind: 'heading', text: 'Parallel options' },
        {
          kind: 'list',
          items: [
            '`parallel="tests"` — each `<test>` block on its own thread.',
            '`parallel="classes"` — each class in parallel.',
            '`parallel="methods"` — each `@Test` method in parallel (fastest, most demanding).',
          ],
        },
        {
          kind: 'callout',
          tone: 'warning',
          title: 'Thread-safe drivers',
          text: 'When running in parallel, never share one `WebDriver` across threads. Give each thread its own driver — a `ThreadLocal<WebDriver>` in your base class is the standard pattern.',
        },
        {
          kind: 'code',
          language: 'java',
          code: `private static final ThreadLocal<WebDriver> DRIVER = new ThreadLocal<>();

@BeforeMethod
public void setUp() { DRIVER.set(new ChromeDriver()); }

protected WebDriver driver() { return DRIVER.get(); }

@AfterMethod
public void tearDown() { driver().quit(); DRIVER.remove(); }`,
        },
      ],
    },
    {
      id: 'reports-listeners',
      title: 'Reports & Listeners',
      summary: 'Read TestNG’s built-in reports and hook into events for screenshots on failure.',
      duration: 10,
      objectives: ['Find the default reports', 'Implement ITestListener', 'Capture a screenshot when a test fails'],
      blocks: [
        { kind: 'heading', text: 'Built-in reports' },
        {
          kind: 'paragraph',
          text: 'After a run, TestNG writes reports to `test-output/`. Open `index.html` (or `emailable-report.html`) for a summary of passed, failed and skipped tests.',
        },
        { kind: 'heading', text: 'Listeners' },
        {
          kind: 'paragraph',
          text: 'A **listener** reacts to test events. The most common use is taking a screenshot the moment a test fails.',
        },
        {
          kind: 'code',
          language: 'java',
          code: `import org.testng.ITestListener;
import org.testng.ITestResult;

public class ScreenshotListener implements ITestListener {
    @Override
    public void onTestFailure(ITestResult result) {
        // cast the driver to TakesScreenshot and save the PNG
        System.out.println("FAILED: " + result.getName());
        // ScreenshotUtil.capture(driver, result.getName());
    }
}`,
        },
        {
          kind: 'paragraph',
          text: 'Register it on a class with `@Listeners(ScreenshotListener.class)` or globally in `testng.xml` under `<listeners>`.',
        },
        {
          kind: 'callout',
          tone: 'tip',
          title: 'Prettier reports',
          text: 'For stakeholder-friendly output, plug in **ExtentReports** or **Allure**. They build on the same listener mechanism and produce rich, filterable dashboards with screenshots.',
        },
        {
          kind: 'callout',
          tone: 'note',
          title: 'Next up',
          text: 'You can now build a complete TestNG + Selenium framework. The **Cucumber** track shows how to describe these same tests in plain-English Gherkin for business-readable BDD.',
        },
      ],
    },
  ],
};

/* ════════════════════════════════════════════════════════════════════════
   TRACK 3 — Cucumber BDD with Java
   ════════════════════════════════════════════════════════════════════════ */

const cucumber: LearningTrack = {
  id: 'cucumber',
  category: 'Selenium',
  title: 'Cucumber BDD with Java',
  subtitle: 'Describe behaviour in plain English',
  description:
    'Behaviour-Driven Development with Cucumber lets you write tests as readable Given/When/Then scenarios, then bind them to Selenium step definitions everyone can understand.',
  icon: Sprout,
  level: 'beginner',
  tags: ['cucumber', 'bdd', 'gherkin', 'java', 'selenium'],
  lessons: [
    {
      id: 'introduction',
      title: 'What is BDD & Cucumber?',
      summary: 'Learn how Behaviour-Driven Development bridges business and automation with shared language.',
      duration: 8,
      objectives: ['Explain BDD in one sentence', 'Name the three Cucumber building blocks', 'Read a Gherkin scenario'],
      blocks: [
        { kind: 'heading', text: 'Tests everyone can read' },
        {
          kind: 'paragraph',
          text: '**Behaviour-Driven Development (BDD)** describes software behaviour in plain language so product owners, testers and developers share one source of truth. **Cucumber** is the tool that runs those English specifications as automated tests.',
        },
        { kind: 'heading', text: 'The three pieces' },
        {
          kind: 'list',
          ordered: true,
          items: [
            '**Feature files** (`.feature`) written in **Gherkin** — the human-readable scenarios.',
            '**Step definitions** — Java methods that match each Gherkin line and drive Selenium.',
            '**A runner** — wires Cucumber to JUnit/TestNG so the scenarios execute.',
          ],
        },
        { kind: 'heading', text: 'A scenario at a glance' },
        {
          kind: 'code',
          language: 'gherkin',
          code: `Feature: Login

  Scenario: Successful login with valid credentials
    Given I am on the login page
    When I sign in as "admin@example.com" with "secret"
    Then I should see my dashboard`,
        },
        {
          kind: 'callout',
          tone: 'note',
          title: 'Given / When / Then',
          text: '**Given** sets up context, **When** is the action under test, **Then** is the expected outcome. `And`/`But` continue the previous keyword.',
        },
      ],
    },
    {
      id: 'setup',
      title: 'Setup: Cucumber + Selenium + Maven',
      summary: 'Add the Cucumber dependencies and create the standard project layout.',
      duration: 11,
      objectives: ['Add cucumber-java and cucumber-testng', 'Understand the folder structure', 'Know where features live'],
      blocks: [
        { kind: 'heading', text: 'Dependencies' },
        {
          kind: 'code',
          language: 'xml',
          code: `<dependency>
  <groupId>io.cucumber</groupId>
  <artifactId>cucumber-java</artifactId>
  <version>7.18.0</version>
  <scope>test</scope>
</dependency>
<dependency>
  <groupId>io.cucumber</groupId>
  <artifactId>cucumber-testng</artifactId>
  <version>7.18.0</version>
  <scope>test</scope>
</dependency>`,
        },
        {
          kind: 'paragraph',
          text: 'Use `cucumber-junit` instead of `cucumber-testng` if your team standardised on JUnit. Keep Selenium from the first track.',
        },
        { kind: 'heading', text: 'Standard layout' },
        {
          kind: 'code',
          language: 'text',
          code: `src/test/
├── java/
│   ├── runners/        TestRunner.java
│   ├── steps/          LoginSteps.java
│   └── pages/          LoginPage.java
└── resources/
    └── features/       login.feature`,
        },
        {
          kind: 'callout',
          tone: 'tip',
          title: 'Feature files go in resources',
          text: '`.feature` files live under `src/test/resources/features` so Maven puts them on the test classpath where Cucumber can discover them.',
        },
      ],
    },
    {
      id: 'first-feature',
      title: 'Writing Your First Feature File',
      summary: 'Author a Gherkin feature with a clear Given/When/Then scenario.',
      duration: 9,
      objectives: ['Write a Feature and Scenario', 'Use Given/When/Then/And', 'Keep steps declarative'],
      practice: ['auth-demo'],
      blocks: [
        { kind: 'heading', text: 'login.feature' },
        {
          kind: 'code',
          language: 'gherkin',
          code: `Feature: User authentication
  As a registered user
  I want to log in
  So that I can access my dashboard

  Scenario: Valid credentials
    Given I am on the login page
    When I enter email "admin@example.com"
    And I enter password "secret"
    And I click the sign-in button
    Then I should see the text "Welcome back"`,
        },
        { kind: 'heading', text: 'Write declarative steps' },
        {
          kind: 'list',
          items: [
            '✅ Declarative: *"When I sign in as an admin"* — describes intent.',
            '❌ Imperative: *"When I type into #email and click #submit"* — leaks UI detail.',
            'Keep scenarios short (3–7 steps). Push mechanics into step definitions and page objects.',
          ],
        },
        {
          kind: 'callout',
          tone: 'note',
          title: 'Quoted parameters',
          text: 'Text in `"double quotes"` becomes a parameter your step definition can capture — that is how the same step works for many values.',
        },
      ],
    },
    {
      id: 'step-definitions',
      title: 'Step Definitions',
      summary: 'Bind each Gherkin line to a Java method that drives Selenium.',
      duration: 12,
      objectives: ['Write @Given/@When/@Then methods', 'Capture parameters from steps', 'Connect steps to Selenium'],
      practice: ['auth-demo', 'buttons'],
      blocks: [
        { kind: 'heading', text: 'Matching steps to code' },
        {
          kind: 'paragraph',
          text: 'Each Gherkin line is matched to a Java method annotated with `@Given`, `@When` or `@Then`. Cucumber uses **Cucumber Expressions** (or regex) to match text and extract parameters.',
        },
        {
          kind: 'code',
          language: 'java',
          code: `import io.cucumber.java.en.*;
import org.openqa.selenium.By;
import org.testng.Assert;

public class LoginSteps {
    // a shared WebDriver, typically injected; see the hooks lesson
    private final WebDriver driver = Hooks.driver;

    @Given("I am on the login page")
    public void onLoginPage() {
        driver.get("https://your-app.test/login");
    }

    @When("I enter email {string}")
    public void enterEmail(String email) {
        driver.findElement(By.cssSelector("[data-testid='login-email']")).sendKeys(email);
    }

    @When("I click the sign-in button")
    public void clickSignIn() {
        driver.findElement(By.cssSelector("[data-testid='login-submit']")).click();
    }

    @Then("I should see the text {string}")
    public void shouldSeeText(String expected) {
        Assert.assertTrue(driver.getPageSource().contains(expected));
    }
}`,
        },
        {
          kind: 'callout',
          tone: 'tip',
          title: 'Cucumber Expressions',
          text: '`{string}`, `{int}` and `{word}` are built-in parameter types that are easier to read than raw regex. They map directly to method arguments in order.',
        },
        {
          kind: 'callout',
          tone: 'warning',
          title: 'Undefined steps',
          text: 'If a step has no matching method, Cucumber prints a **snippet** you can paste in as a starting point. An unimplemented step makes the scenario fail as *undefined* — never silently pass.',
        },
      ],
    },
    {
      id: 'scenario-outline-datatables',
      title: 'Scenario Outline & Data Tables',
      summary: 'Run one scenario over many examples and pass structured data into a step.',
      duration: 11,
      objectives: ['Use Scenario Outline with Examples', 'Read a Data Table in a step', 'Choose between the two'],
      blocks: [
        { kind: 'heading', text: 'Scenario Outline' },
        {
          kind: 'paragraph',
          text: 'A **Scenario Outline** runs the same steps for every row in an `Examples` table — Cucumber’s data-driven testing. Placeholders use angle brackets.',
        },
        {
          kind: 'code',
          language: 'gherkin',
          code: `Scenario Outline: Login attempts
    Given I am on the login page
    When I sign in as "<email>" with "<password>"
    Then the result should be "<outcome>"

    Examples:
      | email               | password | outcome  |
      | admin@example.com   | secret   | success  |
      | user@example.com    | wrong    | failure  |
      | nobody@example.com  | secret   | failure  |`,
        },
        { kind: 'heading', text: 'Data Tables' },
        {
          kind: 'paragraph',
          text: 'A **Data Table** passes a block of structured data into a **single** step — perfect for filling a form.',
        },
        {
          kind: 'code',
          language: 'gherkin',
          code: `When I register with the following details:
  | field    | value             |
  | name     | Alice             |
  | email    | alice@example.com |
  | password | secret123         |`,
        },
        {
          kind: 'code',
          language: 'java',
          code: `import io.cucumber.java.en.When;
import java.util.Map;

@When("I register with the following details:")
public void register(io.cucumber.datatable.DataTable table) {
    Map<String, String> data = table.asMap(String.class, String.class);
    fillField("name", data.get("name"));
    fillField("email", data.get("email"));
    fillField("password", data.get("password"));
}`,
        },
        {
          kind: 'callout',
          tone: 'note',
          title: 'Which one?',
          text: 'Use a **Scenario Outline** to repeat a whole scenario across cases. Use a **Data Table** to hand one step a set of related values.',
        },
      ],
    },
    {
      id: 'hooks-tags',
      title: 'Hooks & Tags',
      summary: 'Run setup/teardown around scenarios and select which scenarios to execute with tags.',
      duration: 10,
      objectives: ['Write @Before/@After hooks', 'Tag scenarios', 'Filter runs by tag expression'],
      blocks: [
        { kind: 'heading', text: 'Hooks' },
        {
          kind: 'paragraph',
          text: 'Cucumber **hooks** run before and after each scenario — the place to open and quit the browser. Import them from `io.cucumber.java`.',
        },
        {
          kind: 'code',
          language: 'java',
          code: `import io.cucumber.java.Before;
import io.cucumber.java.After;
import org.openqa.selenium.chrome.ChromeDriver;

public class Hooks {
    public static WebDriver driver;

    @Before
    public void start() {
        driver = new ChromeDriver();
        driver.manage().window().maximize();
    }

    @After
    public void stop() {
        if (driver != null) driver.quit();
    }
}`,
        },
        { kind: 'heading', text: 'Tags' },
        {
          kind: 'paragraph',
          text: 'Add `@tags` above a `Feature` or `Scenario`, then run only the ones you want.',
        },
        {
          kind: 'code',
          language: 'gherkin',
          code: `@smoke
Scenario: Critical login works
  ...

@regression @slow
Scenario: Rare edge case
  ...`,
        },
        {
          kind: 'code',
          language: 'bash',
          code: `# run only smoke scenarios
mvn test -Dcucumber.filter.tags="@smoke"

# smoke but not slow
mvn test -Dcucumber.filter.tags="@smoke and not @slow"`,
        },
        {
          kind: 'callout',
          tone: 'tip',
          title: 'Tagged hooks',
          text: 'Hooks can be scoped to tags too: `@Before("@db")` runs only before scenarios tagged `@db`. Handy for special setup.',
        },
      ],
    },
    {
      id: 'pom-integration',
      title: 'Cucumber + Page Object Model',
      level: 'intermediate',
      summary: 'Keep step definitions thin by delegating to page objects, just like in the Selenium track.',
      duration: 11,
      objectives: ['Call page objects from steps', 'Share a driver across steps', 'Keep layers clean'],
      blocks: [
        { kind: 'heading', text: 'Thin steps, rich pages' },
        {
          kind: 'paragraph',
          text: 'Step definitions should read like glue, not like Selenium scripts. Move all locators and actions into **page objects** (from the Selenium track) and call them from your steps.',
        },
        {
          kind: 'code',
          language: 'java',
          code: `public class LoginSteps {
    private final LoginPage loginPage = new LoginPage(Hooks.driver);
    private DashboardPage dashboard;

    @Given("I am on the login page")
    public void onLoginPage() {
        Hooks.driver.get(BASE_URL + "/login");
    }

    @When("I sign in as {string} with {string}")
    public void signIn(String email, String password) {
        dashboard = loginPage.loginAs(email, password);
    }

    @Then("I should see my dashboard")
    public void seeDashboard() {
        Assert.assertTrue(dashboard.isLoaded());
    }
}`,
        },
        {
          kind: 'callout',
          tone: 'note',
          title: 'Sharing the driver',
          text: 'For larger suites, use **Dependency Injection** (PicoContainer ships with Cucumber) to share one driver and state across step classes instead of a static field. Add `cucumber-picocontainer` and inject via constructors.',
        },
        {
          kind: 'list',
          items: [
            'Feature file → **what** the user does (business language).',
            'Step definition → **glue** that maps words to actions.',
            'Page object → **how** to operate the page (locators + Selenium).',
          ],
        },
      ],
    },
    {
      id: 'runner-reports',
      title: 'Runner, Reports & Best Practices',
      summary: 'Wire up the runner, generate readable reports and finish with battle-tested habits.',
      duration: 10,
      objectives: ['Create a TestRunner', 'Produce HTML reports', 'Apply BDD best practices'],
      blocks: [
        { kind: 'heading', text: 'The runner' },
        {
          kind: 'code',
          language: 'java',
          code: `import io.cucumber.testng.AbstractTestNGCucumberTests;
import io.cucumber.testng.CucumberOptions;

@CucumberOptions(
    features = "src/test/resources/features",
    glue = {"steps", "hooks"},
    plugin = {
        "pretty",
        "html:target/cucumber-report.html",
        "json:target/cucumber.json"
    }
)
public class TestRunner extends AbstractTestNGCucumberTests {
}`,
        },
        {
          kind: 'paragraph',
          text: 'Run it like any TestNG class (`mvn test`). Cucumber writes a readable HTML report to `target/cucumber-report.html` and machine-readable JSON for CI dashboards.',
        },
        { kind: 'heading', text: 'Best practices' },
        {
          kind: 'list',
          items: [
            'Write scenarios in **business language** — avoid clicks and CSS in feature files.',
            'One scenario should test **one** behaviour.',
            'Reuse steps; do not duplicate near-identical step text.',
            'Keep step definitions **thin** — delegate to page objects.',
            'Use **tags** to organise smoke vs regression runs.',
            'Make scenarios **independent** so they can run in any order.',
          ],
        },
        {
          kind: 'callout',
          tone: 'tip',
          title: 'Prettier reporting',
          text: 'Plug in the **Cucumber Reports** plugin or **Allure** to turn the JSON output into rich, shareable dashboards with steps, timings and screenshots.',
        },
        {
          kind: 'callout',
          tone: 'note',
          title: 'You did it!',
          text: 'You can now write Selenium tests, structure them with TestNG, and describe them in Cucumber BDD. Head to the **Practice Modules** and automate every control end-to-end.',
        },
      ],
    },
  ],
};

/* ════════════════════════════════════════════════════════════════════════
   TRACK 4 — Build a Selenium Java Framework (capstone)
   ════════════════════════════════════════════════════════════════════════ */

const seleniumFramework: LearningTrack = {
  id: 'selenium-framework',
  category: 'Selenium',
  title: 'Build a Selenium Java Framework',
  subtitle: 'Maven · Selenium · TestNG · Cucumber · CI',
  description:
    'The capstone: assemble a production-grade automation framework from scratch — Maven, a thread-safe driver factory, Page Object Model, TestNG, Cucumber BDD, logging, reporting, data-driven tests and CI/CD.',
  icon: Layers3,
  level: 'intermediate',
  tags: ['framework', 'maven', 'testng', 'cucumber', 'pom', 'ci', 'webdrivermanager'],
  lessons: [
    {
      id: 'architecture',
      title: 'Framework Architecture & Tech Stack',
      summary: 'See the big picture: the layers of a real automation framework and how every tool fits.',
      duration: 12,
      objectives: [
        'Explain why a framework beats loose scripts',
        'Name the layers of a layered test framework',
        'Map each tool to its responsibility',
      ],
      blocks: [
        { kind: 'heading', text: 'Why a framework?' },
        {
          kind: 'paragraph',
          text: 'Loose scripts duplicate locators, mix concerns and rot quickly. A **framework** is an opinionated structure that separates *what* you test (scenarios) from *how* you test (driver, pages, utilities). It makes tests readable, reusable, parallel-safe and easy to maintain across hundreds of cases.',
        },
        { kind: 'heading', text: 'The tech stack' },
        {
          kind: 'list',
          items: [
            '**Java 17+** — the programming language.',
            '**Maven** — build tool and dependency manager.',
            '**Selenium WebDriver 4** — browser automation.',
            '**Selenium Manager / WebDriverManager** — automatic driver binaries.',
            '**TestNG** — test runner, lifecycle, parallel execution, suites.',
            '**Cucumber** — Behaviour-Driven Development (Gherkin) layer.',
            '**Log4j2** — structured logging.',
            '**ExtentReports / Allure** — rich HTML reports with screenshots.',
            '**GitHub Actions / Jenkins** — continuous integration.',
          ],
        },
        { kind: 'heading', text: 'The layers' },
        {
          kind: 'list',
          ordered: true,
          items: [
            '**Tests / Features** — business intent (TestNG classes or Cucumber `.feature` files).',
            '**Step definitions** (BDD only) — glue between Gherkin and page objects.',
            '**Page Objects** — locators + actions for each screen.',
            '**Core / utilities** — driver factory, config reader, waits, screenshot, logging.',
            '**Test data** — properties, JSON, Excel, or a data provider.',
            '**Reporting & CI** — outputs and the pipeline that runs everything.',
          ],
        },
        {
          kind: 'code',
          language: 'text',
          code: `┌─────────────────────────────────────────────┐
│  Features / Test classes  (business intent)  │
├─────────────────────────────────────────────┤
│  Step definitions  (BDD glue)                │
├─────────────────────────────────────────────┤
│  Page Objects  (locators + actions)          │
├─────────────────────────────────────────────┤
│  Core  (DriverFactory · Config · Waits · Log)│
├─────────────────────────────────────────────┤
│  Reporting · Test data · CI/CD               │
└─────────────────────────────────────────────┘`,
        },
        {
          kind: 'callout',
          tone: 'tip',
          title: 'One direction of dependency',
          text: 'Upper layers may call lower layers, never the reverse. Tests call pages; pages call core utilities. Core never imports tests. This keeps the framework decoupled and testable.',
        },
        {
          kind: 'callout',
          tone: 'note',
          title: 'We build it incrementally',
          text: 'Over the next lessons you will create each layer in order, ending with a framework that runs the same tests via both TestNG and Cucumber, in parallel, with reports and CI.',
        },
      ],
    },
    {
      id: 'project-setup',
      title: 'Project Setup: JDK, Maven & IntelliJ',
      summary: 'Install the toolchain and scaffold an empty Maven project that the framework will grow into.',
      duration: 11,
      objectives: [
        'Install JDK 17 and Maven',
        'Generate a Maven project skeleton',
        'Open and configure the project in IntelliJ',
      ],
      blocks: [
        { kind: 'heading', text: 'Step 1 — Toolchain' },
        {
          kind: 'list',
          items: [
            '**JDK 17+** (Temurin/Adoptium). Verify: `java -version`.',
            '**Maven 3.9+**. Verify: `mvn -version`.',
            '**IntelliJ IDEA** Community (or Eclipse).',
            '**Git** for version control.',
          ],
        },
        { kind: 'heading', text: 'Step 2 — Generate the skeleton' },
        {
          kind: 'paragraph',
          text: 'Create a standard Maven project with the archetype, or simply make the folders by hand. From a terminal:',
        },
        {
          kind: 'code',
          language: 'bash',
          code: `mvn archetype:generate \\
  -DgroupId=com.automation.framework \\
  -DartifactId=selenium-framework \\
  -DarchetypeArtifactId=maven-archetype-quickstart \\
  -DinteractiveMode=false

cd selenium-framework`,
        },
        { kind: 'heading', text: 'Step 3 — The Maven standard layout' },
        {
          kind: 'code',
          language: 'text',
          code: `selenium-framework/
├── pom.xml
└── src/
    ├── main/java/          # framework code (driver, pages, utils)
    └── test/
        ├── java/           # tests, steps, runners
        └── resources/      # features, config, log4j2, testng.xml`,
        },
        {
          kind: 'callout',
          tone: 'note',
          title: 'main vs test',
          text: 'Reusable framework code (DriverFactory, pages, utilities) lives under `src/main/java`. The tests, step definitions, runners and resources live under `src/test`. This separation lets you later publish the framework as a library if needed.',
        },
        {
          kind: 'callout',
          tone: 'tip',
          title: 'Initialise Git now',
          text: 'Run `git init` and add a `.gitignore` for `target/`, `*.iml`, `.idea/`, `test-output/`, `allure-results/` so build artefacts never get committed.',
        },
      ],
    },
    {
      id: 'pom-dependencies',
      title: 'pom.xml: Dependencies & Plugins',
      summary: 'Declare every library and build plugin the framework needs, with centralized versions.',
      duration: 14,
      objectives: [
        'Centralize versions in <properties>',
        'Add Selenium, TestNG, Cucumber, WDM, Log4j2',
        'Configure the Surefire/compiler plugins',
      ],
      blocks: [
        { kind: 'heading', text: 'Centralized versions' },
        {
          kind: 'paragraph',
          text: 'Keep all version numbers in one `<properties>` block so upgrades are a one-line change. Reference them with the property syntax elsewhere in the POM.',
        },
        {
          kind: 'code',
          language: 'xml',
          code: `<properties>
  <maven.compiler.release>17</maven.compiler.release>
  <project.build.sourceEncoding>UTF-8</project.build.sourceEncoding>
  <selenium.version>4.21.0</selenium.version>
  <testng.version>7.10.2</testng.version>
  <cucumber.version>7.18.0</cucumber.version>
  <wdm.version>5.9.2</wdm.version>
  <log4j.version>2.23.1</log4j.version>
  <extentreports.version>5.1.2</extentreports.version>
  <surefire.version>3.2.5</surefire.version>
</properties>`,
        },
        { kind: 'heading', text: 'Dependencies' },
        {
          kind: 'code',
          language: 'xml',
          code: `<dependencies>
  <dependency>
    <groupId>org.seleniumhq.selenium</groupId>
    <artifactId>selenium-java</artifactId>
    <version>\${selenium.version}</version>
  </dependency>

  <dependency>
    <groupId>org.testng</groupId>
    <artifactId>testng</artifactId>
    <version>\${testng.version}</version>
  </dependency>

  <dependency>
    <groupId>io.cucumber</groupId>
    <artifactId>cucumber-java</artifactId>
    <version>\${cucumber.version}</version>
  </dependency>
  <dependency>
    <groupId>io.cucumber</groupId>
    <artifactId>cucumber-testng</artifactId>
    <version>\${cucumber.version}</version>
  </dependency>
  <dependency>
    <groupId>io.cucumber</groupId>
    <artifactId>cucumber-picocontainer</artifactId>
    <version>\${cucumber.version}</version>
  </dependency>

  <!-- Optional with Selenium 4.6+, required on older versions -->
  <dependency>
    <groupId>io.github.bonigarcia</groupId>
    <artifactId>webdrivermanager</artifactId>
    <version>\${wdm.version}</version>
  </dependency>

  <dependency>
    <groupId>org.apache.logging.log4j</groupId>
    <artifactId>log4j-core</artifactId>
    <version>\${log4j.version}</version>
  </dependency>

  <dependency>
    <groupId>com.aventstack</groupId>
    <artifactId>extentreports</artifactId>
    <version>\${extentreports.version}</version>
  </dependency>
</dependencies>`,
        },
        { kind: 'heading', text: 'Build plugins' },
        {
          kind: 'paragraph',
          text: 'The **Surefire** plugin runs your tests during `mvn test`. Point it at a suite file and you can pass it parameters from the command line.',
        },
        {
          kind: 'code',
          language: 'xml',
          code: `<build>
  <plugins>
    <plugin>
      <groupId>org.apache.maven.plugins</groupId>
      <artifactId>maven-surefire-plugin</artifactId>
      <version>\${surefire.version}</version>
      <configuration>
        <suiteXmlFiles>
          <suiteXmlFile>src/test/resources/testng.xml</suiteXmlFile>
        </suiteXmlFiles>
      </configuration>
    </plugin>
  </plugins>
</build>`,
        },
        {
          kind: 'callout',
          tone: 'warning',
          title: 'Version conflicts',
          text: 'If two libraries pull different Selenium versions, Maven may pick the wrong one. Run `mvn dependency:tree` to inspect the graph and add an explicit dependency to pin the version you want.',
        },
      ],
    },
    {
      id: 'project-structure',
      title: 'Project Structure & Packages',
      summary: 'Lay out packages that mirror the framework layers so every file has an obvious home.',
      duration: 9,
      objectives: ['Design a clean package structure', 'Know where each class belongs', 'Keep concerns separated'],
      blocks: [
        { kind: 'heading', text: 'A package layout that scales' },
        {
          kind: 'code',
          language: 'text',
          code: `src/main/java/com/automation/framework/
├── driver/        DriverFactory.java  DriverManager.java
├── config/        ConfigReader.java   config.properties (in resources)
├── pages/         BasePage.java  LoginPage.java  DashboardPage.java
├── utils/         WaitUtils.java  ScreenshotUtil.java  LoggerUtil.java
└── constants/     FrameworkConstants.java

src/test/java/com/automation/framework/
├── tests/         LoginTest.java          (TestNG)
├── base/          BaseTest.java
├── stepdefs/      LoginSteps.java         (Cucumber)
├── hooks/         Hooks.java
└── runners/       TestRunner.java

src/test/resources/
├── features/      login.feature
├── config.properties
├── log4j2.xml
└── testng.xml`,
        },
        {
          kind: 'list',
          items: [
            '`driver/` — everything about creating and holding the WebDriver.',
            '`config/` — reading environment/config values.',
            '`pages/` — one class per page (Page Object Model).',
            '`utils/` — cross-cutting helpers (waits, screenshots, logging).',
            '`tests/` + `base/` — TestNG tests and the shared base class.',
            '`stepdefs/` + `hooks/` + `runners/` — the Cucumber layer.',
          ],
        },
        {
          kind: 'callout',
          tone: 'tip',
          title: 'Name by responsibility',
          text: 'A newcomer should guess where any class lives from its name alone. `LoginPage` → pages; `ScreenshotUtil` → utils; `DriverFactory` → driver. Consistency is the whole point.',
        },
      ],
    },
    {
      id: 'driver-management',
      title: 'Driver Management & WebDriverManager',
      level: 'advanced',
      summary: 'Build a thread-safe driver factory that supports multiple browsers and parallel runs.',
      duration: 16,
      objectives: [
        'Use Selenium Manager / WebDriverManager for binaries',
        'Create browsers from an enum-driven factory',
        'Make the driver thread-safe with ThreadLocal',
      ],
      practice: ['buttons', 'inputs'],
      blocks: [
        { kind: 'heading', text: 'Drivers without the headaches' },
        {
          kind: 'paragraph',
          text: 'Since Selenium 4.6, **Selenium Manager** auto-downloads the right browser driver — no manual `chromedriver`. On older versions, **WebDriverManager** (`io.github.bonigarcia`) does the same with one line. We will support both browsers and keep each test thread isolated.',
        },
        { kind: 'heading', text: 'The DriverFactory' },
        {
          kind: 'code',
          language: 'java',
          code: `package com.automation.framework.driver;

import org.openqa.selenium.WebDriver;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.chrome.ChromeOptions;
import org.openqa.selenium.firefox.FirefoxDriver;
import org.openqa.selenium.firefox.FirefoxOptions;

public final class DriverFactory {
    private DriverFactory() {}

    public static WebDriver create(String browser, boolean headless) {
        switch (browser.toLowerCase()) {
            case "firefox": {
                FirefoxOptions options = new FirefoxOptions();
                if (headless) options.addArguments("-headless");
                return new FirefoxDriver(options);
            }
            case "chrome":
            default: {
                ChromeOptions options = new ChromeOptions();
                if (headless) options.addArguments("--headless=new");
                options.addArguments("--start-maximized", "--remote-allow-origins=*");
                return new ChromeDriver(options);
            }
        }
    }
}`,
        },
        { kind: 'heading', text: 'Thread-safe holder' },
        {
          kind: 'paragraph',
          text: 'For parallel execution, every thread needs its **own** driver. A `ThreadLocal<WebDriver>` gives each thread an isolated instance behind a simple API.',
        },
        {
          kind: 'code',
          language: 'java',
          code: `package com.automation.framework.driver;

import org.openqa.selenium.WebDriver;

public final class DriverManager {
    private static final ThreadLocal<WebDriver> DRIVER = new ThreadLocal<>();

    private DriverManager() {}

    public static WebDriver get() {
        return DRIVER.get();
    }

    public static void set(WebDriver driver) {
        DRIVER.set(driver);
    }

    public static void quit() {
        WebDriver driver = DRIVER.get();
        if (driver != null) {
            driver.quit();
            DRIVER.remove();   // prevent memory leaks between tests
        }
    }
}`,
        },
        {
          kind: 'callout',
          tone: 'note',
          title: 'WebDriverManager (older Selenium)',
          text: 'On Selenium < 4.6, add `WebDriverManager.chromedriver().setup();` before `new ChromeDriver()`. With 4.6+ you can delete that line — Selenium Manager handles it automatically.',
        },
        {
          kind: 'callout',
          tone: 'warning',
          title: 'Always remove() the ThreadLocal',
          text: 'Forgetting `DRIVER.remove()` after `quit()` leaks driver references across reused threads in a pool and causes flaky, hard-to-debug failures in parallel runs.',
        },
      ],
    },
    {
      id: 'configuration',
      title: 'Configuration Management',
      summary: 'Externalize URLs, browser and timeouts into a properties file read through a typed helper.',
      duration: 11,
      objectives: ['Create config.properties', 'Read it with a singleton ConfigReader', 'Override values from the command line'],
      blocks: [
        { kind: 'heading', text: 'Never hard-code environment values' },
        {
          kind: 'paragraph',
          text: 'Base URL, browser, timeouts and credentials change per environment. Keep them in `src/test/resources/config.properties` and read them through one typed helper.',
        },
        {
          kind: 'code',
          language: 'properties',
          code: `# src/test/resources/config.properties
base.url=https://your-app.test
browser=chrome
headless=false
explicit.wait=10
implicit.wait=0`,
        },
        { kind: 'heading', text: 'A singleton ConfigReader' },
        {
          kind: 'code',
          language: 'java',
          code: `package com.automation.framework.config;

import java.io.InputStream;
import java.util.Properties;

public final class ConfigReader {
    private static final Properties PROPS = new Properties();

    static {
        try (InputStream in = ConfigReader.class.getClassLoader()
                .getResourceAsStream("config.properties")) {
            PROPS.load(in);
        } catch (Exception e) {
            throw new RuntimeException("Unable to load config.properties", e);
        }
    }

    private ConfigReader() {}

    public static String get(String key) {
        // System property wins, so -Dbrowser=firefox overrides the file.
        return System.getProperty(key, PROPS.getProperty(key));
    }

    public static String baseUrl()      { return get("base.url"); }
    public static String browser()      { return get("browser"); }
    public static boolean headless()    { return Boolean.parseBoolean(get("headless")); }
    public static int explicitWait()    { return Integer.parseInt(get("explicit.wait")); }
}`,
        },
        {
          kind: 'callout',
          tone: 'tip',
          title: 'Command-line overrides',
          text: 'Because `System.getProperty` is checked first, `mvn test -Dbrowser=firefox -Dheadless=true` overrides the file without editing it — perfect for CI matrix runs.',
        },
        {
          kind: 'callout',
          tone: 'warning',
          title: 'Keep secrets out of git',
          text: 'Never commit real passwords or API keys. Read secrets from environment variables (`System.getenv`) or a CI secret store, and keep only safe defaults in the properties file.',
        },
      ],
    },
    {
      id: 'page-objects',
      title: 'BasePage & Page Object Model',
      summary: 'Create a BasePage of reusable actions, then build page classes on top of it.',
      duration: 15,
      objectives: ['Write a BasePage with safe actions', 'Centralize explicit waits', 'Build a LoginPage on top'],
      practice: ['auth-demo', 'inputs', 'buttons'],
      blocks: [
        { kind: 'heading', text: 'A BasePage every page extends' },
        {
          kind: 'paragraph',
          text: 'Wrap raw Selenium calls in a `BasePage` so every page gets safe, waited interactions for free. This eliminates duplicated waits and makes pages tiny.',
        },
        {
          kind: 'code',
          language: 'java',
          code: `package com.automation.framework.pages;

import com.automation.framework.config.ConfigReader;
import com.automation.framework.driver.DriverManager;
import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;
import java.time.Duration;

public abstract class BasePage {
    protected final WebDriver driver;
    protected final WebDriverWait wait;

    protected BasePage() {
        this.driver = DriverManager.get();
        this.wait = new WebDriverWait(driver, Duration.ofSeconds(ConfigReader.explicitWait()));
    }

    protected WebElement visible(By locator) {
        return wait.until(ExpectedConditions.visibilityOfElementLocated(locator));
    }

    protected void click(By locator) {
        wait.until(ExpectedConditions.elementToBeClickable(locator)).click();
    }

    protected void type(By locator, String text) {
        WebElement el = visible(locator);
        el.clear();
        el.sendKeys(text);
    }

    protected String textOf(By locator) {
        return visible(locator).getText();
    }
}`,
        },
        { kind: 'heading', text: 'A LoginPage built on BasePage' },
        {
          kind: 'code',
          language: 'java',
          code: `package com.automation.framework.pages;

import com.automation.framework.config.ConfigReader;
import org.openqa.selenium.By;

public class LoginPage extends BasePage {
    private final By email    = By.cssSelector("[data-testid='login-email']");
    private final By password = By.cssSelector("[data-testid='login-password']");
    private final By submit   = By.cssSelector("[data-testid='login-submit']");

    public LoginPage open() {
        driver.get(ConfigReader.baseUrl() + "/login");
        return this;
    }

    public DashboardPage loginAs(String user, String pass) {
        type(email, user);
        type(password, pass);
        click(submit);
        return new DashboardPage();
    }
}`,
        },
        {
          kind: 'callout',
          tone: 'tip',
          title: 'Return the next page',
          text: 'Returning a `DashboardPage` from `loginAs` models real navigation and enables a fluent style: `new LoginPage().open().loginAs(u, p).assertLoaded();`',
        },
        {
          kind: 'callout',
          tone: 'note',
          title: 'No assertions in pages',
          text: 'Pages expose state (getters) but do not assert. Keep assertions in tests/steps so a page can be reused by many scenarios with different expectations.',
        },
      ],
    },
    {
      id: 'testng-integration',
      title: 'TestNG Integration: BaseTest & Suites',
      summary: 'Wire driver lifecycle into a BaseTest, then drive parallel runs from testng.xml.',
      duration: 14,
      objectives: ['Open/quit the driver per test', 'Write a TestNG test on the pages', 'Run in parallel from a suite file'],
      practice: ['auth-demo'],
      blocks: [
        { kind: 'heading', text: 'BaseTest owns the lifecycle' },
        {
          kind: 'code',
          language: 'java',
          code: `package com.automation.framework.base;

import com.automation.framework.config.ConfigReader;
import com.automation.framework.driver.DriverFactory;
import com.automation.framework.driver.DriverManager;
import org.testng.annotations.AfterMethod;
import org.testng.annotations.BeforeMethod;

public abstract class BaseTest {
    @BeforeMethod
    public void setUp() {
        DriverManager.set(DriverFactory.create(ConfigReader.browser(), ConfigReader.headless()));
    }

    @AfterMethod(alwaysRun = true)
    public void tearDown() {
        DriverManager.quit();
    }
}`,
        },
        { kind: 'heading', text: 'A clean test' },
        {
          kind: 'code',
          language: 'java',
          code: `package com.automation.framework.tests;

import com.automation.framework.base.BaseTest;
import com.automation.framework.pages.DashboardPage;
import com.automation.framework.pages.LoginPage;
import org.testng.Assert;
import org.testng.annotations.Test;

public class LoginTest extends BaseTest {

    @Test
    public void userCanLogIn() {
        DashboardPage dashboard = new LoginPage()
            .open()
            .loginAs("admin@example.com", "secret");

        Assert.assertTrue(dashboard.isLoaded(), "Dashboard should load after login");
    }
}`,
        },
        { kind: 'heading', text: 'Parallel suite' },
        {
          kind: 'code',
          language: 'xml',
          code: `<!DOCTYPE suite SYSTEM "https://testng.org/testng-1.0.dtd">
<suite name="Regression" parallel="methods" thread-count="4">
  <listeners>
    <listener class-name="com.automation.framework.utils.TestListener"/>
  </listeners>
  <test name="UI">
    <classes>
      <class name="com.automation.framework.tests.LoginTest"/>
    </classes>
  </test>
</suite>`,
        },
        {
          kind: 'callout',
          tone: 'warning',
          title: 'Parallel needs ThreadLocal',
          text: 'Because each method runs on its own thread and our `DriverManager` is `ThreadLocal`, parallel execution is safe out of the box. Never store the driver in a plain static field.',
        },
      ],
    },
    {
      id: 'cucumber-integration',
      title: 'Cucumber BDD Integration',
      level: 'advanced',
      summary: 'Add a Gherkin layer that reuses the very same pages and driver via hooks.',
      duration: 15,
      objectives: ['Create a Cucumber runner', 'Share the driver in hooks', 'Reuse page objects from steps'],
      practice: ['auth-demo'],
      blocks: [
        { kind: 'heading', text: 'The runner' },
        {
          kind: 'code',
          language: 'java',
          code: `package com.automation.framework.runners;

import io.cucumber.testng.AbstractTestNGCucumberTests;
import io.cucumber.testng.CucumberOptions;

@CucumberOptions(
    features = "src/test/resources/features",
    glue = {"com.automation.framework.stepdefs", "com.automation.framework.hooks"},
    plugin = {
        "pretty",
        "html:target/cucumber-report.html",
        "json:target/cucumber.json"
    }
)
public class TestRunner extends AbstractTestNGCucumberTests {
}`,
        },
        { kind: 'heading', text: 'Hooks reuse the same driver lifecycle' },
        {
          kind: 'code',
          language: 'java',
          code: `package com.automation.framework.hooks;

import com.automation.framework.config.ConfigReader;
import com.automation.framework.driver.DriverFactory;
import com.automation.framework.driver.DriverManager;
import io.cucumber.java.After;
import io.cucumber.java.Before;
import io.cucumber.java.Scenario;

public class Hooks {
    @Before
    public void start() {
        DriverManager.set(DriverFactory.create(ConfigReader.browser(), ConfigReader.headless()));
    }

    @After
    public void stop(Scenario scenario) {
        // screenshot-on-failure is added in the reporting lesson
        DriverManager.quit();
    }
}`,
        },
        { kind: 'heading', text: 'Feature + thin steps' },
        {
          kind: 'code',
          language: 'gherkin',
          code: `# src/test/resources/features/login.feature
Feature: Login

  Scenario: Valid credentials
    Given I am on the login page
    When I sign in as "admin@example.com" with "secret"
    Then I should see my dashboard`,
        },
        {
          kind: 'code',
          language: 'java',
          code: `package com.automation.framework.stepdefs;

import com.automation.framework.pages.DashboardPage;
import com.automation.framework.pages.LoginPage;
import io.cucumber.java.en.*;
import org.testng.Assert;

public class LoginSteps {
    private final LoginPage loginPage = new LoginPage();
    private DashboardPage dashboard;

    @Given("I am on the login page")
    public void onLoginPage() { loginPage.open(); }

    @When("I sign in as {string} with {string}")
    public void signIn(String user, String pass) {
        dashboard = loginPage.loginAs(user, pass);
    }

    @Then("I should see my dashboard")
    public void seeDashboard() {
        Assert.assertTrue(dashboard.isLoaded());
    }
}`,
        },
        {
          kind: 'callout',
          tone: 'note',
          title: 'Sharing state across steps',
          text: 'The `cucumber-picocontainer` dependency lets Cucumber inject shared objects (like a test context holding the current driver/page) into multiple step classes via their constructors — the clean alternative to static fields.',
        },
        {
          kind: 'callout',
          tone: 'tip',
          title: 'One framework, two front doors',
          text: 'Notice both the TestNG `LoginTest` and the Cucumber `LoginSteps` reuse the *same* `LoginPage`, `DriverFactory` and `ConfigReader`. That reuse is the whole reason to build a framework.',
        },
      ],
    },
    {
      id: 'logging',
      title: 'Logging with Log4j2',
      summary: 'Add structured, leveled logging so failures are diagnosable from the console and files.',
      duration: 9,
      objectives: ['Configure log4j2.xml', 'Log at the right levels', 'Wire logging into the framework'],
      blocks: [
        { kind: 'heading', text: 'Why logging beats System.out' },
        {
          kind: 'paragraph',
          text: '`System.out.println` cannot be filtered, timestamped or routed to files. **Log4j2** gives you levels (`DEBUG`/`INFO`/`WARN`/`ERROR`), timestamps and multiple outputs (console + rolling file) from one config.',
        },
        { kind: 'heading', text: 'log4j2.xml' },
        {
          kind: 'code',
          language: 'xml',
          code: `<!-- src/test/resources/log4j2.xml -->
<Configuration status="WARN">
  <Appenders>
    <Console name="Console" target="SYSTEM_OUT">
      <PatternLayout pattern="%d{HH:mm:ss.SSS} [%t] %-5level %logger{36} - %msg%n"/>
    </Console>
    <File name="File" fileName="target/logs/automation.log">
      <PatternLayout pattern="%d{yyyy-MM-dd HH:mm:ss} [%t] %-5level %logger - %msg%n"/>
    </File>
  </Appenders>
  <Loggers>
    <Root level="info">
      <AppenderRef ref="Console"/>
      <AppenderRef ref="File"/>
    </Root>
  </Loggers>
</Configuration>`,
        },
        { kind: 'heading', text: 'Use it in code' },
        {
          kind: 'code',
          language: 'java',
          code: `import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;

public class LoginPage extends BasePage {
    private static final Logger log = LogManager.getLogger(LoginPage.class);

    public DashboardPage loginAs(String user, String pass) {
        log.info("Logging in as {}", user);
        type(email, user);
        type(password, pass);
        click(submit);
        log.debug("Submitted login form");
        return new DashboardPage();
    }
}`,
        },
        {
          kind: 'callout',
          tone: 'tip',
          title: 'Levels with intent',
          text: 'Use INFO for high-level steps a reader cares about, DEBUG for detail you only want when diagnosing, WARN for recoverable oddities and ERROR for failures. Keep the console at INFO and files at DEBUG.',
        },
      ],
    },
    {
      id: 'reporting',
      title: 'Reporting & Screenshots on Failure',
      level: 'advanced',
      summary: 'Produce rich HTML reports with ExtentReports/Allure and auto-capture screenshots when tests fail.',
      duration: 14,
      objectives: ['Capture a screenshot on failure', 'Generate an ExtentReports dashboard', 'Attach evidence to the report'],
      blocks: [
        { kind: 'heading', text: 'Screenshot utility' },
        {
          kind: 'code',
          language: 'java',
          code: `package com.automation.framework.utils;

import com.automation.framework.driver.DriverManager;
import org.openqa.selenium.OutputType;
import org.openqa.selenium.TakesScreenshot;
import java.io.File;
import java.nio.file.Files;
import java.nio.file.Path;

public final class ScreenshotUtil {
    private ScreenshotUtil() {}

    public static Path capture(String name) {
        TakesScreenshot ts = (TakesScreenshot) DriverManager.get();
        File src = ts.getScreenshotAs(OutputType.FILE);
        try {
            Path dest = Path.of("target/screenshots", name + ".png");
            Files.createDirectories(dest.getParent());
            Files.copy(src.toPath(), dest);
            return dest;
        } catch (Exception e) {
            throw new RuntimeException("Screenshot failed", e);
        }
    }
}`,
        },
        { kind: 'heading', text: 'A TestNG listener that reacts to failures' },
        {
          kind: 'code',
          language: 'java',
          code: `package com.automation.framework.utils;

import org.testng.ITestListener;
import org.testng.ITestResult;

public class TestListener implements ITestListener {
    @Override
    public void onTestFailure(ITestResult result) {
        ScreenshotUtil.capture(result.getName());
        // ExtentManager.getTest().fail(result.getThrowable());
    }

    @Override
    public void onTestSuccess(ITestResult result) {
        // ExtentManager.getTest().pass("passed");
    }
}`,
        },
        { kind: 'heading', text: 'Cucumber: screenshot in the @After hook' },
        {
          kind: 'code',
          language: 'java',
          code: `@After
public void stop(Scenario scenario) {
    if (scenario.isFailed()) {
        byte[] png = ((TakesScreenshot) DriverManager.get())
                .getScreenshotAs(OutputType.BYTES);
        scenario.attach(png, "image/png", scenario.getName());
    }
    DriverManager.quit();
}`,
        },
        {
          kind: 'callout',
          tone: 'note',
          title: 'ExtentReports vs Allure',
          text: '**ExtentReports** is a self-contained HTML dashboard configured in code. **Allure** is a richer, CI-friendly report generated from test result files via the Allure plugin (`mvn allure:serve`). Both attach screenshots; pick one to start.',
        },
        {
          kind: 'callout',
          tone: 'tip',
          title: 'Thread-safe Extent',
          text: 'In parallel runs, store the current Extent test node in a `ThreadLocal<ExtentTest>` (an `ExtentManager`) so each thread writes to its own node without clashing.',
        },
      ],
    },
    {
      id: 'data-driven',
      title: 'Data-Driven Testing & Test Data',
      summary: 'Feed many inputs into tests from data providers and external files for broad coverage.',
      duration: 11,
      objectives: ['Use a TestNG @DataProvider', 'Externalize data to JSON/Excel', 'Keep data out of code'],
      practice: ['tables', 'inputs'],
      blocks: [
        { kind: 'heading', text: 'DataProvider in the framework' },
        {
          kind: 'code',
          language: 'java',
          code: `@DataProvider(name = "logins")
public Object[][] logins() {
    return new Object[][] {
        { "admin@example.com", "secret", true  },
        { "user@example.com",  "wrong",  false },
    };
}

@Test(dataProvider = "logins")
public void login(String email, String pass, boolean ok) {
    boolean success = new LoginPage().open().tryLogin(email, pass);
    Assert.assertEquals(success, ok);
}`,
        },
        { kind: 'heading', text: 'Externalize to JSON' },
        {
          kind: 'paragraph',
          text: 'Hard-coded arrays do not scale. Read rows from a JSON file (with Jackson/Gson) inside the provider so testers add cases without touching Java.',
        },
        {
          kind: 'code',
          language: 'java',
          code: `@DataProvider(name = "logins")
public Object[][] logins() throws Exception {
    var mapper = new com.fasterxml.jackson.databind.ObjectMapper();
    var rows = mapper.readValue(
        getClass().getResourceAsStream("/data/logins.json"),
        LoginRow[].class);
    return java.util.Arrays.stream(rows)
        .map(r -> new Object[]{ r.email(), r.password(), r.expected() })
        .toArray(Object[][]::new);
}`,
        },
        {
          kind: 'callout',
          tone: 'tip',
          title: 'Cucumber equivalent',
          text: 'In BDD, a `Scenario Outline` with an `Examples` table is the data-driven mechanism — the same idea expressed in Gherkin.',
        },
        {
          kind: 'callout',
          tone: 'warning',
          title: 'Keep tests independent',
          text: 'Each data row must create and clean up its own state. Never let one row depend on data left behind by another — that breaks parallel and shuffled runs.',
        },
      ],
    },
    {
      id: 'execution-ci',
      title: 'Execution, Maven Profiles & CI/CD',
      level: 'advanced',
      summary: 'Run the suite locally and on every push with GitHub Actions, across browsers.',
      duration: 13,
      objectives: ['Run via Maven with overrides', 'Define Maven profiles', 'Add a GitHub Actions pipeline'],
      blocks: [
        { kind: 'heading', text: 'Run locally' },
        {
          kind: 'code',
          language: 'bash',
          code: `# default (chrome, from config.properties)
mvn clean test

# override browser + headless for CI
mvn clean test -Dbrowser=chrome -Dheadless=true

# run only smoke-tagged Cucumber scenarios
mvn clean test -Dcucumber.filter.tags="@smoke"`,
        },
        { kind: 'heading', text: 'Maven profiles for environments' },
        {
          kind: 'code',
          language: 'xml',
          code: `<profiles>
  <profile>
    <id>ci</id>
    <properties>
      <browser>chrome</browser>
      <headless>true</headless>
    </properties>
  </profile>
</profiles>`,
        },
        {
          kind: 'paragraph',
          text: 'Activate with `mvn test -Pci`. Profiles bundle a set of properties so CI and local runs stay consistent.',
        },
        { kind: 'heading', text: 'GitHub Actions pipeline' },
        {
          kind: 'code',
          language: 'yaml',
          code: `# .github/workflows/tests.yml
name: UI Tests
on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-java@v4
        with:
          distribution: temurin
          java-version: '17'
          cache: maven
      - name: Run tests
        run: mvn -B clean test -Pci
      - name: Upload report
        if: always()
        uses: actions/upload-artifact@v4
        with:
          name: cucumber-report
          path: target/cucumber-report.html`,
        },
        {
          kind: 'callout',
          tone: 'note',
          title: 'Headless in CI',
          text: 'CI machines have no display, so always run `--headless`. Ubuntu runners ship with Chrome and Selenium Manager fetches the matching driver automatically.',
        },
        {
          kind: 'callout',
          tone: 'tip',
          title: 'Fail the build, save the evidence',
          text: 'Use `if: always()` on the artifact upload so reports and screenshots are saved even when tests fail — that is exactly when you need them.',
        },
      ],
    },
    {
      id: 'best-practices',
      title: 'Best Practices & Project Checklist',
      summary: 'Lock in the habits that keep a framework fast, stable and maintainable as it grows.',
      duration: 10,
      objectives: ['Apply framework best practices', 'Avoid common anti-patterns', 'Use a go-live checklist'],
      blocks: [
        { kind: 'heading', text: 'Do' },
        {
          kind: 'list',
          items: [
            'Keep the **driver in ThreadLocal**; never share across threads.',
            'Prefer **explicit waits**; never `Thread.sleep`.',
            'Use **stable locators** (`data-testid`/id) over brittle XPath.',
            'One **page object per screen**; no assertions inside pages.',
            'Externalize **config and test data**; no hard-coded values.',
            'Make every test **independent** and self-cleaning.',
            'Log meaningfully and **capture screenshots on failure**.',
            'Run **headless in CI** on every push.',
          ],
        },
        { kind: 'heading', text: 'Avoid' },
        {
          kind: 'list',
          items: [
            'Mixing implicit and explicit waits.',
            'Static `WebDriver` fields in parallel suites.',
            'Locators copied from the browser “Copy full XPath”.',
            'Giant test methods that verify ten things at once.',
            'Committing `target/`, reports or secrets to git.',
          ],
        },
        { kind: 'heading', text: 'Go-live checklist' },
        {
          kind: 'list',
          ordered: true,
          items: [
            '`mvn clean test` passes locally and headless.',
            'Tests run green in **parallel** (thread-count > 1).',
            'A deliberate failure produces a **screenshot** and a clear report.',
            'Config is overridable from the command line / CI.',
            'The pipeline runs on push and uploads artefacts.',
            'README explains how to run and extend the framework.',
          ],
        },
        {
          kind: 'callout',
          tone: 'note',
          title: 'You built a real framework',
          text: 'You now have a layered Selenium framework driven by both TestNG and Cucumber, with config, logging, reporting, data-driven tests, parallel execution and CI. Practise by automating the live modules end-to-end.',
        },
        {
          kind: 'callout',
          tone: 'tip',
          title: 'Keep practising',
          text: 'Point your framework at this site: automate Login, then the Buttons, Inputs, Dropdowns, Tables and Alerts modules. Each one exercises a different part of your BasePage.',
        },
      ],
    },
  ],
};

/* ════════════════════════════════════════════════════════════════════════
   TRACK 5 — Advanced Selenium Automation (programs-heavy)
   ════════════════════════════════════════════════════════════════════════ */

const advancedSelenium: LearningTrack = {
  id: 'advanced-selenium',
  category: 'Selenium',
  title: 'Advanced Selenium Automation',
  subtitle: 'Grid, CDP, patterns & hybrid testing',
  description:
    'Go beyond the basics: relative locators, custom waits, JavaScriptExecutor, the Actions API, Selenium Grid with Docker, design patterns, API+UI hybrid tests, flaky-test retries and DevTools network control — each with runnable Java.',
  icon: Rocket,
  level: 'advanced',
  tags: ['advanced', 'grid', 'docker', 'cdp', 'patterns', 'restassured'],
  lessons: [
    {
      id: 'relative-locators',
      title: 'Relative Locators & Advanced Selectors',
      summary: 'Use Selenium 4 relative locators and advanced CSS/XPath to target elements by their neighbours.',
      duration: 12,
      level: 'intermediate',
      practice: ['tables', 'dropdowns'],
      objectives: [
        'Use above/below/toLeftOf/near locators',
        'Write advanced CSS and XPath axes',
        'Locate elements relative to a known anchor',
      ],
      blocks: [
        { kind: 'heading', text: 'Selenium 4 relative locators' },
        {
          kind: 'paragraph',
          text: 'Sometimes an element has no stable attributes but sits next to one that does. **Relative locators** find elements by spatial relationship — `above`, `below`, `toLeftOf`, `toRightOf` and `near`.',
        },
        {
          kind: 'code',
          language: 'java',
          code: `import static org.openqa.selenium.support.locators.RelativeLocator.with;
import org.openqa.selenium.By;
import org.openqa.selenium.WebElement;

// The password field sits below the email field
WebElement email = driver.findElement(By.id("email"));
WebElement password = driver.findElement(with(By.tagName("input")).below(email));

// The "Edit" button to the right of a row label
WebElement edit = driver.findElement(
    with(By.tagName("button")).toRightOf(By.xpath("//td[text()='Alice']")));

// Within 50px of an anchor
WebElement hint = driver.findElement(with(By.tagName("span")).near(email));`,
        },
        { kind: 'heading', text: 'Advanced XPath axes' },
        {
          kind: 'code',
          language: 'java',
          code: `// Parent / ancestor
driver.findElement(By.xpath("//input[@id='email']/ancestor::form"));

// Following-sibling: the label's input
driver.findElement(By.xpath("//label[text()='Email']/following-sibling::input"));

// Match by partial, normalized text
driver.findElement(By.xpath("//button[contains(normalize-space(),'Add to')]"));`,
        },
        {
          kind: 'callout',
          tone: 'tip',
          title: 'Prefer attributes first',
          text: 'Relative locators and axes are powerful but slower and more brittle than a `data-testid`. Reach for them only when no stable attribute exists.',
        },
      ],
    },
    {
      id: 'custom-waits',
      title: 'Custom Waits & Synchronization',
      summary: 'Write your own ExpectedConditions and wait for AJAX/JS frameworks to settle.',
      duration: 13,
      level: 'advanced',
      practice: ['ajax', 'spinners', 'delayed-loading', 'stale-elements'],
      objectives: [
        'Compose a custom ExpectedCondition',
        'Wait for jQuery/AJAX to finish',
        'Avoid stale-element exceptions',
      ],
      blocks: [
        { kind: 'heading', text: 'Your own ExpectedCondition' },
        {
          kind: 'paragraph',
          text: 'The built-in conditions cover most cases, but you can write any predicate. An `ExpectedCondition<T>` is just a function from `WebDriver` to a result; return `null`/`false` to keep polling.',
        },
        {
          kind: 'code',
          language: 'java',
          code: `import org.openqa.selenium.support.ui.ExpectedCondition;
import org.openqa.selenium.support.ui.WebDriverWait;
import java.time.Duration;

ExpectedCondition<Boolean> attributeEquals(By locator, String attr, String value) {
    return driver -> {
        try {
            return value.equals(driver.findElement(locator).getAttribute(attr));
        } catch (org.openqa.selenium.StaleElementReferenceException e) {
            return false; // element re-rendered; keep polling
        }
    };
}

new WebDriverWait(driver, Duration.ofSeconds(10))
    .until(attributeEquals(By.id("status"), "data-state", "ready"));`,
        },
        { kind: 'heading', text: 'Wait for AJAX / jQuery to settle' },
        {
          kind: 'code',
          language: 'java',
          code: `import org.openqa.selenium.JavascriptExecutor;

boolean ajaxDone() {
    JavascriptExecutor js = (JavascriptExecutor) driver;
    // jQuery active requests == 0, and document is complete
    Object active = js.executeScript(
        "return (window.jQuery ? jQuery.active : 0) === 0 && document.readyState === 'complete'");
    return Boolean.TRUE.equals(active);
}

new WebDriverWait(driver, Duration.ofSeconds(15))
    .until(d -> ajaxDone());`,
        },
        {
          kind: 'callout',
          tone: 'warning',
          title: 'Stale elements',
          text: 'A `StaleElementReferenceException` means the element was re-rendered after you found it. Re-find inside the wait (as above) instead of caching the `WebElement`.',
        },
      ],
    },
    {
      id: 'javascript-executor',
      title: 'JavaScriptExecutor in Practice',
      summary: 'Drive the page with JavaScript when WebDriver alone is not enough: scroll, click, set values and pierce shadow DOM.',
      duration: 12,
      level: 'intermediate',
      practice: ['shadow-dom', 'infinite-scroll'],
      objectives: ['Scroll and click via JS', 'Read/write values and styles', 'Pierce shadow DOM'],
      blocks: [
        { kind: 'heading', text: 'The escape hatch' },
        {
          kind: 'paragraph',
          text: '`JavascriptExecutor` runs arbitrary JS in the page. Use it for scrolling, forcing clicks on covered elements, reading computed state, or reaching into shadow roots — but prefer real WebDriver actions when they work, because JS bypasses real-user behaviour.',
        },
        {
          kind: 'code',
          language: 'java',
          code: `JavascriptExecutor js = (JavascriptExecutor) driver;

// Scroll an element into view
WebElement el = driver.findElement(By.id("load-more"));
js.executeScript("arguments[0].scrollIntoView({block:'center'});", el);

// Force a click (e.g., element overlapped by a sticky header)
js.executeScript("arguments[0].click();", el);

// Set a value and dispatch the events frameworks listen for
WebElement input = driver.findElement(By.id("email"));
js.executeScript(
    "arguments[0].value = arguments[1];" +
    "arguments[0].dispatchEvent(new Event('input', {bubbles:true}));",
    input, "user@example.com");

// Read page state
long height = (long) js.executeScript("return document.body.scrollHeight;");`,
        },
        { kind: 'heading', text: 'Pierce the shadow DOM' },
        {
          kind: 'code',
          language: 'java',
          code: `// Selenium 4 can step into shadow roots natively
WebElement host = driver.findElement(By.cssSelector("my-widget"));
SearchContext shadow = host.getShadowRoot();
WebElement inner = shadow.findElement(By.cssSelector("button.action"));
inner.click();`,
        },
        {
          kind: 'callout',
          tone: 'warning',
          title: 'Use sparingly',
          text: 'A JS click never fails the way a real user click would (disabled, covered, off-screen). Over-using JS hides real bugs — keep it for genuine edge cases.',
        },
      ],
    },
    {
      id: 'actions-api',
      title: 'The Actions API: Mouse & Keyboard',
      summary: 'Compose low-level input sequences for hover menus, drag-and-drop and keyboard chords.',
      duration: 12,
      level: 'intermediate',
      practice: ['drag-drop', 'mouse-actions', 'keyboard'],
      objectives: ['Build action chains', 'Hover, drag and right-click', 'Send key combinations'],
      blocks: [
        { kind: 'heading', text: 'Composing input' },
        {
          kind: 'paragraph',
          text: 'The `Actions` class builds a sequence of low-level pointer and keyboard events, then `.perform()` runs them. It is how you automate hover menus, drag-and-drop, click-and-hold and modifier keys.',
        },
        {
          kind: 'code',
          language: 'java',
          code: `import org.openqa.selenium.interactions.Actions;
import org.openqa.selenium.Keys;

Actions actions = new Actions(driver);

// Hover to reveal a dropdown, then click an item
actions.moveToElement(menu).pause(Duration.ofMillis(200))
       .moveToElement(submenuItem).click().perform();

// Drag and drop
actions.dragAndDrop(source, target).perform();

// Or fine-grained: click-hold, move, release
actions.clickAndHold(source)
       .moveByOffset(120, 0)
       .release()
       .perform();

// Right-click (context menu)
actions.contextClick(element).perform();

// Keyboard chord: Ctrl+A then Delete
actions.keyDown(Keys.CONTROL).sendKeys("a").keyUp(Keys.CONTROL)
       .sendKeys(Keys.DELETE).perform();`,
        },
        {
          kind: 'callout',
          tone: 'tip',
          title: 'Add small pauses for animations',
          text: 'Hover menus often animate. A short `.pause(...)` between moves makes drag-and-drop and fly-out menus far more reliable.',
        },
        {
          kind: 'callout',
          tone: 'note',
          title: 'HTML5 drag-and-drop',
          text: 'Native HTML5 drag-and-drop sometimes ignores the Actions API. If `dragAndDrop` does nothing, fall back to dispatching `dragstart`/`drop` events via JavaScriptExecutor.',
        },
      ],
    },
    {
      id: 'grid-docker',
      title: 'Selenium Grid & Docker',
      summary: 'Run tests remotely and in parallel across browsers using Grid 4 and Docker.',
      duration: 15,
      level: 'advanced',
      objectives: ['Connect with RemoteWebDriver', 'Stand up Grid with Docker Compose', 'Scale browser nodes'],
      blocks: [
        { kind: 'heading', text: 'Why a Grid?' },
        {
          kind: 'paragraph',
          text: '**Selenium Grid** runs your tests on remote machines/containers so you can execute many browsers in parallel and on browser versions you do not have locally. Your test connects to the Grid hub with `RemoteWebDriver`.',
        },
        {
          kind: 'code',
          language: 'java',
          code: `import org.openqa.selenium.remote.RemoteWebDriver;
import org.openqa.selenium.chrome.ChromeOptions;
import java.net.URL;

ChromeOptions options = new ChromeOptions();
WebDriver driver = new RemoteWebDriver(
    new URL("http://localhost:4444/wd/hub"), options);`,
        },
        { kind: 'heading', text: 'Spin up a Grid with Docker' },
        {
          kind: 'code',
          language: 'yaml',
          code: `# docker-compose.yml
services:
  selenium-hub:
    image: selenium/hub:4.21
    ports: ["4442:4442", "4443:4443", "4444:4444"]

  chrome:
    image: selenium/node-chrome:4.21
    shm_size: 2gb
    depends_on: [selenium-hub]
    environment:
      - SE_EVENT_BUS_HOST=selenium-hub
      - SE_EVENT_BUS_PUBLISH_PORT=4442
      - SE_EVENT_BUS_SUBSCRIBE_PORT=4443
      - SE_NODE_MAX_SESSIONS=4

  firefox:
    image: selenium/node-firefox:4.21
    shm_size: 2gb
    depends_on: [selenium-hub]
    environment:
      - SE_EVENT_BUS_HOST=selenium-hub
      - SE_EVENT_BUS_PUBLISH_PORT=4442
      - SE_EVENT_BUS_SUBSCRIBE_PORT=4443`,
        },
        {
          kind: 'code',
          language: 'bash',
          code: `docker compose up -d        # start the grid
# open http://localhost:4444 to watch sessions
mvn test -Dremote=true -Dgrid.url=http://localhost:4444/wd/hub
docker compose down         # tear it down`,
        },
        {
          kind: 'callout',
          tone: 'tip',
          title: 'Make the URL configurable',
          text: 'Have your `DriverFactory` return a `RemoteWebDriver` when a `remote=true` system property is set, and read the hub URL from config. The same tests then run locally or on the Grid with no code change.',
        },
        {
          kind: 'callout',
          tone: 'warning',
          title: 'shm_size matters',
          text: 'Chrome in Docker crashes with the default shared-memory size. Always set `shm_size: 2gb` (or mount `/dev/shm`) on browser nodes.',
        },
      ],
    },
    {
      id: 'design-patterns',
      title: 'Design Patterns for Frameworks',
      summary: 'Apply Singleton, Factory, Fluent, Strategy and Builder patterns to keep a framework clean.',
      duration: 14,
      level: 'advanced',
      objectives: ['Recognize key patterns', 'Apply them to driver, pages and data', 'Avoid over-engineering'],
      blocks: [
        { kind: 'heading', text: 'Patterns that actually pay off' },
        {
          kind: 'list',
          items: [
            '**Singleton** — one shared resource (e.g., a `ThreadLocal` driver holder).',
            '**Factory** — create browsers from a string/enum (`DriverFactory`).',
            '**Fluent Interface** — chainable page methods that return the next page.',
            '**Strategy** — swap interchangeable behaviours (browser, environment).',
            '**Builder** — assemble complex test data readably.',
          ],
        },
        { kind: 'heading', text: 'Strategy: a browser per enum' },
        {
          kind: 'code',
          language: 'java',
          code: `public enum BrowserType {
    CHROME {
        public WebDriver create(boolean headless) {
            ChromeOptions o = new ChromeOptions();
            if (headless) o.addArguments("--headless=new");
            return new ChromeDriver(o);
        }
    },
    FIREFOX {
        public WebDriver create(boolean headless) {
            FirefoxOptions o = new FirefoxOptions();
            if (headless) o.addArguments("-headless");
            return new FirefoxDriver(o);
        }
    };
    public abstract WebDriver create(boolean headless);
}

// Usage
WebDriver driver = BrowserType.valueOf(browser.toUpperCase()).create(headless);`,
        },
        { kind: 'heading', text: 'Builder: readable test data' },
        {
          kind: 'code',
          language: 'java',
          code: `public class User {
    private final String name, email, role;
    private User(Builder b) { name = b.name; email = b.email; role = b.role; }

    public static class Builder {
        private String name = "Test User";
        private String email = "test@example.com";
        private String role = "user";
        public Builder name(String v)  { this.name = v;  return this; }
        public Builder email(String v) { this.email = v; return this; }
        public Builder role(String v)  { this.role = v;  return this; }
        public User build() { return new User(this); }
    }
}

User admin = new User.Builder().name("Alice").role("admin").build();`,
        },
        {
          kind: 'callout',
          tone: 'warning',
          title: 'Patterns serve the code, not the reverse',
          text: 'Add a pattern only when it removes real duplication or coupling. A two-line helper does not need a Factory. Over-engineering is as harmful as no structure.',
        },
      ],
    },
    {
      id: 'api-ui-hybrid',
      title: 'Hybrid API + UI Testing',
      summary: 'Use REST Assured to seed data and log in fast, then verify the result through the UI.',
      duration: 13,
      level: 'advanced',
      practice: ['api-testing', 'auth-demo'],
      objectives: ['Call APIs with REST Assured', 'Set up state via API, assert via UI', 'Inject auth tokens into the browser'],
      blocks: [
        { kind: 'heading', text: 'Why mix layers?' },
        {
          kind: 'paragraph',
          text: 'Driving every precondition through the UI is slow and brittle. A **hybrid** test sets up state through fast API calls, then exercises only the behaviour under test through the browser.',
        },
        {
          kind: 'code',
          language: 'java',
          code: `import io.restassured.RestAssured;
import static io.restassured.RestAssured.given;

// 1) Log in via API to grab a token (fast, no UI)
String token = given()
        .contentType("application/json")
        .body("{\\"email\\":\\"admin@example.com\\",\\"password\\":\\"secret\\"}")
    .when()
        .post("https://your-app.test/api/auth/login")
    .then()
        .statusCode(200)
        .extract().path("accessToken");

// 2) Seed a record via API
given().header("Authorization", "Bearer " + token)
       .contentType("application/json")
       .body("{\\"name\\":\\"Acme\\"}")
    .when().post("https://your-app.test/api/customers")
    .then().statusCode(201);`,
        },
        { kind: 'heading', text: 'Inject the token into the browser' },
        {
          kind: 'code',
          language: 'java',
          code: `// Skip the login screen: drop the token into storage, then load the app
driver.get("https://your-app.test");
((JavascriptExecutor) driver).executeScript(
    "window.localStorage.setItem('accessToken', arguments[0]);", token);
driver.navigate().refresh();

// Now assert the seeded customer shows in the UI
new CrmPage().open().search("Acme").assertRowVisible("Acme");`,
        },
        {
          kind: 'callout',
          tone: 'tip',
          title: 'Test the UI, not the plumbing',
          text: 'Reserve UI steps for what only the UI can verify. Everything else (auth, data setup, cleanup) is faster and more stable through the API.',
        },
      ],
    },
    {
      id: 'retry-flaky',
      title: 'Taming Flaky Tests: Retries & Allure',
      summary: 'Automatically retry intermittent failures with TestNG and surface results in Allure.',
      duration: 11,
      level: 'advanced',
      practice: ['random-elements', 'stale-elements'],
      objectives: ['Implement an IRetryAnalyzer', 'Apply it globally', 'Report richly with Allure'],
      blocks: [
        { kind: 'heading', text: 'Retry, but understand why' },
        {
          kind: 'paragraph',
          text: 'Some failures are genuinely intermittent (network blips, animations). A **retry analyzer** re-runs a failed test a bounded number of times. Use it as a safety net — not to hide real flakiness you should fix.',
        },
        {
          kind: 'code',
          language: 'java',
          code: `import org.testng.IRetryAnalyzer;
import org.testng.ITestResult;

public class RetryAnalyzer implements IRetryAnalyzer {
    private int count = 0;
    private static final int MAX = 2;

    @Override
    public boolean retry(ITestResult result) {
        if (count < MAX) { count++; return true; }
        return false;
    }
}`,
        },
        { kind: 'heading', text: 'Apply it to every test automatically' },
        {
          kind: 'code',
          language: 'java',
          code: `import org.testng.IAnnotationTransformer;
import org.testng.annotations.ITestAnnotation;
import java.lang.reflect.*;

public class RetryTransformer implements IAnnotationTransformer {
    @Override
    public void transform(ITestAnnotation ann, Class c, Constructor ctor, Method m) {
        ann.setRetryAnalyzer(RetryAnalyzer.class);
    }
}
// Register in testng.xml: <listener class-name="...RetryTransformer"/>`,
        },
        { kind: 'heading', text: 'Allure reporting' },
        {
          kind: 'code',
          language: 'java',
          code: `import io.qameta.allure.Step;
import io.qameta.allure.Allure;

@Step("Log in as {user}")
public DashboardPage loginAs(String user, String pass) {
    // ... steps appear as a tree in the Allure report ...
    return new DashboardPage();
}

// Attach a screenshot to the report
Allure.addAttachment("screenshot", "image/png",
    new java.io.ByteArrayInputStream(pngBytes), "png");`,
        },
        {
          kind: 'code',
          language: 'bash',
          code: `mvn clean test
mvn allure:serve   # opens the interactive Allure dashboard`,
        },
        {
          kind: 'callout',
          tone: 'warning',
          title: 'Track your retries',
          text: 'A test that only passes on retry is still a bug. Log retried tests and review them — retries should trend toward zero, not become a crutch.',
        },
      ],
    },
    {
      id: 'cdp-network',
      title: 'DevTools (CDP): Network & More',
      summary: 'Use the Chrome DevTools Protocol via Selenium 4 to mock network, set geolocation and read console logs.',
      duration: 13,
      level: 'advanced',
      practice: ['api-testing'],
      objectives: ['Open a DevTools session', 'Intercept and mock network', 'Capture console errors'],
      blocks: [
        { kind: 'heading', text: 'Browser superpowers' },
        {
          kind: 'paragraph',
          text: 'Selenium 4 exposes the **Chrome DevTools Protocol (CDP)**. With it you can throttle the network, block or mock requests, fake geolocation, inject headers and capture console/JS errors — things classic WebDriver cannot do.',
        },
        {
          kind: 'code',
          language: 'java',
          code: `import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.devtools.DevTools;
import org.openqa.selenium.devtools.v126.network.Network;
import java.util.Optional;

ChromeDriver driver = new ChromeDriver();
DevTools devTools = driver.getDevTools();
devTools.createSession();

// Capture all console / network errors
devTools.send(Network.enable(Optional.empty(), Optional.empty(), Optional.empty()));
devTools.addListener(Network.loadingFailed(), failed ->
    System.out.println("Request failed: " + failed.getErrorText()));`,
        },
        { kind: 'heading', text: 'Mock a backend response' },
        {
          kind: 'code',
          language: 'java',
          code: `import org.openqa.selenium.devtools.v126.fetch.Fetch;

devTools.send(Fetch.enable(Optional.empty(), Optional.empty()));
devTools.addListener(Fetch.requestPaused(), req -> {
    if (req.getRequest().getUrl().contains("/api/customers")) {
        String body = java.util.Base64.getEncoder()
            .encodeToString("[{\\"name\\":\\"Mocked\\"}]".getBytes());
        devTools.send(Fetch.fulfillRequest(req.getRequestId(), 200,
            java.util.List.of(), Optional.of(body), Optional.empty()));
    } else {
        devTools.send(Fetch.continueRequest(req.getRequestId(),
            Optional.empty(), Optional.empty(), Optional.empty(),
            Optional.empty(), Optional.empty()));
    }
});`,
        },
        {
          kind: 'callout',
          tone: 'note',
          title: 'Version-specific imports',
          text: 'The `v126` package must match your Chrome major version. Selenium also offers a stable, version-agnostic BiDi API that is replacing raw CDP — prefer it as it matures.',
        },
        {
          kind: 'callout',
          tone: 'tip',
          title: 'Test the hard cases',
          text: 'CDP lets you reproduce flaky-only-in-prod scenarios: slow 3G, a failing API, an expired token. These are exactly the cases manual testing misses.',
        },
      ],
    },
  ],
};

/* ════════════════════════════════════════════════════════════════════════
   Public API
   ════════════════════════════════════════════════════════════════════════ */

export const LEARNING_TRACKS: LearningTrack[] = [
  seleniumJava,
  testng,
  cucumber,
  seleniumFramework,
  advancedSelenium,
  ...seleniumRealWorldTracks,
  ...playwrightTracks,
];

/** Catalog categories in display order. */
export const LEARNING_CATEGORIES: LearningCategory[] = ['Selenium', 'Playwright'];

export const CATEGORY_BLURB: Record<LearningCategory, string> = {
  Selenium:
    'The W3C WebDriver standard with Java — from your first browser launch to Grid, CDP, design patterns and the daily problems senior SDETs solve.',
  Playwright:
    'Microsoft’s modern, fast, auto-waiting framework with TypeScript — from your first test to network mocking, auth reuse, visual testing, CI sharding and expert real-world patterns.',
};

/** All tracks in a given tool family (Selenium / Playwright). */
export function getTracksByCategory(category: LearningCategory): LearningTrack[] {
  return LEARNING_TRACKS.filter((t) => t.category === category);
}

/** Tracks in a family at a given difficulty level. */
export function getTracksByCategoryAndLevel(
  category: LearningCategory,
  level: Difficulty,
): LearningTrack[] {
  return LEARNING_TRACKS.filter((t) => t.category === category && t.level === level);
}

export function getTrackById(id: string): LearningTrack | undefined {
  return LEARNING_TRACKS.find((t) => t.id === id);
}

export function getLesson(
  trackId: string,
  lessonId: string,
): { track: LearningTrack; lesson: Lesson; index: number } | undefined {
  const track = getTrackById(trackId);
  if (!track) return undefined;
  const index = track.lessons.findIndex((l) => l.id === lessonId);
  const lesson = track.lessons[index];
  if (index === -1 || !lesson) return undefined;
  return { track, lesson, index };
}

/** Previous/next lesson within the same track. */
export function getAdjacentLessons(
  trackId: string,
  lessonId: string,
): { prev?: Lesson; next?: Lesson } {
  const track = getTrackById(trackId);
  if (!track) return {};
  const index = track.lessons.findIndex((l) => l.id === lessonId);
  if (index === -1) return {};
  return {
    prev: index > 0 ? track.lessons[index - 1] : undefined,
    next: index < track.lessons.length - 1 ? track.lessons[index + 1] : undefined,
  };
}

export function trackPath(trackId: string): string {
  return `/learning/${trackId}`;
}

export function lessonPath(trackId: string, lessonId: string): string {
  return `/learning/${trackId}/${lessonId}`;
}

export function trackDuration(track: LearningTrack): number {
  return track.lessons.reduce((total, lesson) => total + lesson.duration, 0);
}

/** Difficulty ordered from easiest to hardest, for grouping and sorting. */
export const DIFFICULTY_ORDER: Difficulty[] = ['beginner', 'intermediate', 'advanced'];

export const DIFFICULTY_LABELS: Record<Difficulty, string> = {
  beginner: 'Beginner',
  intermediate: 'Intermediate',
  advanced: 'Advanced',
};

/** A lesson's effective difficulty (its own, or the track's as a fallback). */
export function lessonLevel(track: LearningTrack, lesson: Lesson): Difficulty {
  return lesson.level ?? track.level;
}

/** All tracks that sit at a given difficulty level. */
export function getTracksByLevel(level: Difficulty): LearningTrack[] {
  return LEARNING_TRACKS.filter((t) => t.level === level);
}

/** Search learning tracks by title, subtitle, description, tags or lesson text. */
export function searchLearningTracks(query: string): LearningTrack[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  return LEARNING_TRACKS.filter(
    (t) =>
      t.title.toLowerCase().includes(q) ||
      t.subtitle.toLowerCase().includes(q) ||
      t.description.toLowerCase().includes(q) ||
      t.tags.some((tag) => tag.includes(q)) ||
      t.lessons.some(
        (l) => l.title.toLowerCase().includes(q) || l.summary.toLowerCase().includes(q),
      ),
  );
}

/** Resolve a lesson's `practice` module ids into full module metadata. */
export function getPracticeModules(ids: string[] = []): ModuleMeta[] {
  return ids
    .map((id) => MODULES.find((m) => m.id === id))
    .filter((m): m is ModuleMeta => Boolean(m));
}

export const TOTAL_LESSONS = LEARNING_TRACKS.reduce((sum, t) => sum + t.lessons.length, 0);
