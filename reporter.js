import fs from "fs/promises";

async function sendTestResults(results) {
  try {
    const response = await fetch(
      "https://edugen-backend-487d2168bc6c.herokuapp.com/projectLog/",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(results),
      },
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
  } catch (error) {
    console.error("Failed to send test results:", error);
  }
}

async function getUserId() {
  try {
    const userId = (await fs.readFile("student_id.txt", "utf-8")).trim();

    // Varsayılan değerleri kontrol et
    const defaultValues = ["123456"];

    if (!userId) {
      throw new Error("Lütfen öğrenci numaranı student_id.txt dosyasına ekle.");
    }

    if (defaultValues.includes(userId)) {
      throw new Error(
        "Öğrenci numaranı eklemeyi unutmuşsun gibi görünüyor. öğrenci numaranı student_id.txt dosyasına ekle.",
      );
    }

    return userId;
  } catch (error) {
    if (error.code === "ENOENT") {
      throw new Error(
        "student_id.txt dosyası bulunamadı. Bu dosyayı yarat ve içine Kaizu'da belirtilen öğrenci numaranı yaz.",
      );
    }
    throw error;
  }
}

export default class MyJsonReporter {
  constructor(options) {
    this.outputFile = options.outputFile || "playwright-report.json";
    this.results = [];
  }

  onTestEnd(test, result) {
    this.results.push({
      title: test.title,
      status: result.status,
      duration: result.duration, // ms
    });
  }

  async onEnd(result) {
    const stats = {
      expected: 0,
      unexpected: 0,
      skipped: 0,
      flaky: 0,
      duration: -1,
    };

    for (const r of this.results) {
      stats.duration += r.duration || 0;

      switch (r.status) {
        case "passed":
          stats.expected++;
          break;
        case "failed":
          stats.unexpected++;
          break;
        case "skipped":
          stats.skipped++;
          break;
        case "flaky":
          stats.flaky++;
          break;
      }
    }

    const report = {
      stats,
      tests: this.results,
    };

    await fs.writeFile(this.outputFile, JSON.stringify(report, null, 2));

    const userId = await getUserId();
    const css = await fs.readFile("style.css", "utf-8");
    const html = await fs.readFile("index.html", "utf-8");

    const total = stats.expected + stats.unexpected + stats.skipped +
      stats.flaky;
    const passed = stats.expected;

    const payload = {
      is_auto: true,
      project_id: 529,
      user_files: {
        "/style.css": { code: css },
        "/index.html": { code: html },
      },
      user_id: Number(userId),
      user_score: total > 0 ? Math.round((passed / total) * 100) : -1,
    };

    await sendTestResults(payload);
  }
}
