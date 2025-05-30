import { expect, test } from "@playwright/test";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import * as css from "css";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

function flattenRules(rules) {
  const result = [];
  for (const rule of rules) {
    if (rule.type === "rule") {
      result.push(rule);
    } else if (rule.type === "media" && Array.isArray(rule.rules)) {
      // media context’i belirtelim
      for (const innerRule of rule.rules) {
        result.push({ ...innerRule, media: rule.media });
      }
    }
  }
  return result;
}

async function assertFontSizeRule(
  selector,
  property,
  expectedValues,
  forMedia = false,
) {
  const cssPath = path.resolve(__dirname, "../style.css");
  const cssContent = fs.readFileSync(cssPath, "utf-8");
  const parsed = css.parse(cssContent);
  const allRules = flattenRules(parsed.stylesheet?.rules ?? []);

  const matchingRules = allRules.filter(
    (r) =>
      r.selectors?.some((sel) => sel.trim() === selector.trim()) &&
      (forMedia ? !!r.media : !r.media),
  );

  if (matchingRules.length === 0) {
    throw new Error(
      `Selector '${selector}' ${
        forMedia ? "media query içinde" : "normal stil içinde"
      } bulunamadı`,
    );
  }

  const matchingRuleWithProp = matchingRules.find((rule) =>
    rule.declarations?.some(
      (decl) => decl.type === "declaration" && decl.property === property,
    )
  );

  if (!matchingRuleWithProp) {
    throw new Error(
      `❌ Selector '${selector}' için '${property}' tanımı yok (${
        forMedia ? "media query içinde" : "normal stil içinde"
      })`,
    );
  }

  const declaration = matchingRuleWithProp.declarations.find(
    (decl) => decl.type === "declaration" && decl.property === property,
  );

  if (!expectedValues.includes(declaration.value)) {
    throw new Error(
      `❌ Selector '${selector}' için '${property}' değeri '${declaration.value}' bulundu, ancak '${
        expectedValues.join(", ")
      }' bekleniyordu (${
        forMedia ? "media query içinde" : "normal stil içinde"
      })`,
    );
  }
}

let context;

test.beforeAll(async ({ browser }) => {
  context = await browser.newContext({
    viewport: { width: 450, height: 766 },
  });
});

test.afterAll(async () => {
  await context.close();
});

test.describe.parallel("Responsive testler", () => {
  test("Viewport meta etiketi doğru ayarlanmış mı?", async () => {
    const page = await context.newPage();
    await page.goto("http://localhost:3003");
    const viewportMetaContent = await page.evaluate(() => {
      const metaTag = document.querySelector('meta[name="viewport"]');
      return metaTag ? metaTag.content : null;
    });

    expect(viewportMetaContent).toBe("width=device-width, initial-scale=1.0");
    await page.close();
  });

  test("Doküman yazı boyutu mobile göre ayarlanmış mı?", async () => {
    const page = await context.newPage();
    await page.goto("http://localhost:3003");

    const fontSize = await page
      .locator("html")
      .evaluate((el) => getComputedStyle(el).fontSize);
    expect(fontSize).toBe("16px");
    await page.close();
  });

  test("Ana başlık font boyutu doküman font boyutuna endekslenmiş mi?", async () => {
    const page = await context.newPage();
    await page.goto("http://localhost:3003");

    await assertFontSizeRule(".hero h1", "font-size", ["2rem"]);
    await page.close();
  });

  test("Menü font boyutu doküman font boyutuna endekslenmiş mi?", async () => {
    const page = await context.newPage();
    await page.goto("http://localhost:3003");

    await assertFontSizeRule("nav", "font-size", ["0.75rem"]);
    await page.close();
  });

  test(".wrapper-centered genişliği mobile göre ayarlanmış mı?", async () => {
    const page = await context.newPage();
    await page.goto("http://localhost:3003");

    const wrappers = await page.locator(".wrapper-centered");
    const count = await wrappers.count();

    if (count > 0) {
      const ilkWrapper = await wrappers.nth(0);
      const width = await ilkWrapper.evaluate((el) =>
        getComputedStyle(el).width
      );
      expect(width).toBe("450px");
    } else {
      console.warn(
        "Uyarı: .wrapper-centered seçicisine eşleşen öğe bulunamadı.",
      );
    }
    await page.close();
  });

  test("Header öğeler arası gap mobile uygun ayarlanmış mı?", async () => {
    const page = await context.newPage();
    await page.goto("http://localhost:3003");

    const gap = await page
      .locator("header")
      .evaluate((el) => getComputedStyle(el).gap);
    expect(gap).toBe("15px");
    await page.close();
  });

  test("Header öğesinin padding değerleri mobile uygun ayarlanmış mı?", async () => {
    const page = await context.newPage();
    await page.goto("http://localhost:3003");

    const padding = await page
      .locator("header")
      .evaluate((el) => getComputedStyle(el).padding);
    expect(padding).toBe("20px 10px 15px");
    await page.close();
  });

  test("Header öğesinin flex yönü mobile uygun ayarlanmış mı?", async () => {
    const page = await context.newPage();
    await page.goto("http://localhost:3003");

    const flexDirection = await page
      .locator("header")
      .evaluate((el) => getComputedStyle(el).flexDirection);
    expect(flexDirection).toBe("column");
    await page.close();
  });

  test("Header öğesinin flex yönüne göre hizası mobile uygun ayarlanmış mı?", async () => {
    const page = await context.newPage();
    await page.goto("http://localhost:3003");

    const justifyContent = await page
      .locator("header")
      .evaluate((el) => getComputedStyle(el).justifyContent);
    expect(justifyContent).toBe("center");
    await page.close();
  });

  test("Header öğesinin flex yönünün dik eksenine göre hizası mobile uygun ayarlanmış mı?", async () => {
    const page = await context.newPage();
    await page.goto("http://localhost:3003");

    const alignItems = await page
      .locator("header")
      .evaluate((el) => getComputedStyle(el).alignItems);
    expect(alignItems).toBe("stretch");
    await page.close();
  });

  // nav a { text-align: center; } için test (page.locator().evaluate() ile)
  test("Nav linkleri yazı hizası mobil tasarıma uygun mu?", async () => {
    const page = await context.newPage();
    await page.goto("http://localhost:3003");

    const links = await page.locator("nav a");
    const count = await links.count();

    if (count > 0) {
      const ilkWrapper = await links.nth(0);
      const textAlign = await ilkWrapper.evaluate((el) =>
        getComputedStyle(el).textAlign
      );
      expect(textAlign).toBe("center");
    } else {
      console.warn("Uyarı: nav a seçicisine eşleşen öğe bulunamadı.");
    }
    await page.close();
  });

  test(".hero öğesinin yüksekliği mobile uygun ayarlanmış mı?", async () => {
    const page = await context.newPage();
    await page.goto("http://localhost:3003");

    await assertFontSizeRule(".hero", "height", ["70vh"], true);
    await page.close();
  });

  // .hero { margin-top: 0; } için test (page.locator().evaluate() ile)
  test(".hero öğesinin üstündeki boşluk mobile uygun ayarlanmış mı?", async () => {
    const page = await context.newPage();
    await page.goto("http://localhost:3003");

    const marginTop = await page
      .locator(".hero")
      .evaluate((el) => getComputedStyle(el).marginTop);

    expect(marginTop).toBe("0px");
    await page.close();
  });

  // .hero { padding: 10px; } için test (page.locator().evaluate() ile)
  test(".hero öğesinin iç boşluğu mobile uygun ayarlanmış mı?", async () => {
    const page = await context.newPage();
    await page.goto("http://localhost:3003");

    const padding = await page
      .locator(".hero")
      .evaluate((el) => getComputedStyle(el).padding);
    expect(padding).toBe("10px");
    await page.close();
  });

  // .hero { border-radius: 0; } için test (page.locator().evaluate() ile)
  test(".hero öğesinin köşe yuvarlaklığı mobile uygun ayarlanmış mı?", async () => {
    const page = await context.newPage();
    await page.goto("http://localhost:3003");

    const borderRadius = await page
      .locator(".hero")
      .evaluate((el) => getComputedStyle(el).borderRadius);
    expect(borderRadius).toBe("0px");
    await page.close();
  });

  // .hero { justify-content: center; } için test (page.locator().evaluate() ile)
  test(".hero öğesinin flex yönüne göre hizası mobile uygun ayarlanmış mı?", async () => {
    const page = await context.newPage();
    await page.goto("http://localhost:3003");

    const justifyContent = await page
      .locator(".hero")
      .evaluate((el) => getComputedStyle(el).justifyContent);
    expect(justifyContent).toBe("center");
    await page.close();
  });

  // .hero { align-items: center; } için test (page.locator().evaluate() ile)
  test(".hero öğesinin flex yönünün dik eksenine göre hizası mobile uygun ayarlanmış mı?", async () => {
    const page = await context.newPage();
    await page.goto("http://localhost:3003");

    const alignItems = await page
      .locator(".hero")
      .evaluate((el) => getComputedStyle(el).alignItems);
    expect(alignItems).toBe("center");
    await page.close();
  });

  test("Nav linklerinin genişlikleri mobile uygun ayarlanmış mı?", async () => {
    const page = await context.newPage();
    await page.goto("http://localhost:3003");

    const links = await page.locator("nav a");
    const count = await links.count();

    let flexOk = false;
    let widthOk = false;

    if (count > 0) {
      const firstLink = await links.nth(0);
      const flex = await firstLink.evaluate((el) => getComputedStyle(el).flex);
      flexOk = flex === "1 1 0%";
    } else {
      console.warn("Uyarı: nav a seçicisine eşleşen öğe bulunamadı.");
    }

    try {
      await assertFontSizeRule("nav a", "width", ["25%"], true);
      widthOk = true;
    } catch (err) {
      // widthOk false kalacak
    }

    expect(flexOk || widthOk).toBe(true);
    await page.close();
  });
});
