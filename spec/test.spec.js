import { Builder, By, Key, until } from "selenium-webdriver";
import "chromedriver";
import "assert";

let page = {
    login: {
        username: "username",
        password: "password",
        loginButton:
            "/html/body/div/div[1]/div/div[1]/div/div[2]/div[2]/form/div[3]/button",
    },
    input: {
        loginInput: "Admin",
        passwordInput: "admin123",
        jobInput: {
            title: "Test1",
            description: "Test description",
            notes: "Test notes",
        },
    },
    admin: {
        name: "Admin",
        jobList: {
            jobBy: "//span[text()='Job ']",
            jobTitlesBy: "//a[text()='Job Titles']",
            jobAddBy: "//button[text()=' Add ']",
            table: ".oxd-table-cell>div",
            testJobDel:
                "//div[text() = 'Test1']//ancestor::div[@class='oxd-table-card']//child::i[@class='oxd-icon bi-trash']",
            delConfirmation: "//button[text()=' Yes, Delete ']",
        },
        jobPath: {
            jobTitleBy:
                "//html/body/div/div[1]/div[2]/div[2]/div/div/form/div[1]/div/div[2]/input",
            jobDescription: "//textarea[@placeholder='Type description here']",
            notesBy: "//textarea[@placeholder='Add note']",
            saveBy: "//button[text()=' Save ']",
        },
    },
};

const timeWait = 20000;
const yourBrowser = "chrome";
const expectedFlagResult = 1;

async function scenarioOfTest() {
    let driver = await new Builder().forBrowser(yourBrowser).build();
    let flags = {
        authorisation: 0,
        jobPage: 0,
        addingJob: 0,
        check: 0,
        deletingJob: 1,
    };
    await driver.manage().window().maximize();
    await driver.get("https://opensource-demo.orangehrmlive.com/");
    await driver
        .wait(until.elementLocated(By.name(page.login.username)), timeWait)
        .sendKeys(page.input.loginInput);
    await driver
        .wait(until.elementLocated(By.name(page.login.password)), timeWait)
        .sendKeys(page.input.passwordInput);
    await driver
        .wait(until.elementLocated(By.xpath(page.login.loginButton)), timeWait)
        .click();
    flags.authorisation = 1;

    await driver
        .wait(until.elementLocated(By.partialLinkText(page.admin.name)), timeWait)
        .click();
    await driver
        .wait(until.elementLocated(By.xpath(page.admin.jobList.jobBy)), timeWait)
        .click();
    await driver
        .wait(until.elementLocated(By.xpath(page.admin.jobList.jobTitlesBy)), timeWait)
        .click();
    await driver
        .wait(until.elementLocated(By.xpath(page.admin.jobList.jobAddBy)), timeWait)
        .click();
    flags.jobPage = 1;

    await driver
        .wait(
            until.elementLocated(By.xpath(page.admin.jobPath.jobTitleBy)),
            timeWait
        )
        .sendKeys(page.input.jobInput.title);
    await driver
        .wait(
            until.elementLocated(By.xpath(page.admin.jobPath.jobDescription)),
            timeWait
        )
        .sendKeys(page.input.jobInput.description);
    await driver
        .wait(until.elementLocated(By.xpath(page.admin.jobPath.notesBy)), timeWait)
        .sendKeys(page.input.jobInput.notes);
    await driver
        .wait(until.elementLocated(By.xpath(page.admin.jobPath.saveBy)), timeWait)
        .click();
    flags.addingJob = 1;

    let list = await driver.wait(until.elementsLocated(By.css(page.admin.jobList.table), timeWait))
    for (let i = 0; i < list.length; i++) {
        let checkJ = await list[i].getText()
        if (checkJ === 'Test1') {
            flags.check = 1
            await list[i - 1].click()
            break
        }
    }

    await driver
        .wait(until.elementLocated(By.xpath(page.admin.jobList.testJobDel)), timeWait)
        .click();
    await driver
        .wait(until.elementLocated(By.xpath(page.admin.jobList.delConfirmation)), timeWait)
        .click();

    list = await driver.wait(until.elementsLocated(By.css(page.admin.jobList.table), timeWait))
    for (let i = 0; i < list.length; i++) {
        let text1 = await list[i].getText()
        if (text1 === 'Test1') {
            flags.deletingJob = 0
        }
    }

    driver.quit();
    return flags;
}

let flags = await scenarioOfTest();

describe("Steps: ", () => {
    it("Step 1: Loggin", () => {
        expect(flags.authorisation).toBe(expectedFlagResult);
    });
    it("Step 2: Going to the page for adding a job", () => {
        expect(flags.jobPage).toBe(expectedFlagResult);
    });
    it("Step 3: Adding a new job", () => {
        expect(flags.addingJob).toBe(expectedFlagResult);
    });
    it("Step 4: Checking data entry", () => {
        expect(flags.check).toBe(expectedFlagResult);
    });
    it("Step 5: Deletion of entered data and check of deletion", () => {
        expect(flags.deletingJob).toBe(expectedFlagResult);
    });
});
