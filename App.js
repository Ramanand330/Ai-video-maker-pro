
const $ = (id) => document.getElementById(id);

function buildPrompt() {
  const topic = $("topic").value.trim();

  if (!topic) {
    alert("Please enter your video topic!");
    $("topic").focus();
    return;
  }

  const language = $("language").value;
  const format = $("format").value;
  const duration = $("duration").value;
  const style = $("style").value;
  const voice = $("voice").value;

  const prompt = `
AI VIDEO MAKER PRO - VIDEO PROJECT

TOPIC:
${topic}

VIDEO SETTINGS:
Language: ${language}
Format: ${format}
Duration: ${duration}
Visual Style: ${style}
Voice-over: ${voice}

VIDEO INSTRUCTIONS:
Create a professional, engaging video about the given topic.
Use realistic cinematic visuals.
Include an attractive opening hook.
Use smooth camera movements and transitions.
Keep every scene visually interesting.
Use clear narration and suitable background music.
End with a memorable conclusion.

FORMAT:
${format === "9:16"
  ? "Vertical video for YouTube Shorts and Reels."
  : "Horizontal video for YouTube."}

IMPORTANT:
Maintain visual consistency.
Avoid watermarks and unnecessary text.
  `.trim();

  $("output").value = prompt;
  $("status").textContent = "Prompt Ready ✓";
}

function saveProject() {
  const topic = $("topic").value.trim();
  const output = $("output").value;

  if (!topic || !output) {
    alert("पहले वीडियो का Prompt बनाइए।");
    return;
  }

  let projects = JSON.parse(
    localStorage.getItem("avmp_projects") || "[]"
  );

  projects.unshift({
    topic,
    output,
    date: new Date().toLocaleString()
  });

  projects = projects.slice(0, 20);

  localStorage.setItem(
    "avmp_projects",
    JSON.stringify(projects)
  );

  showProjects();
  alert("Project successfully saved!");
}

function showProjects() {
  const projects = JSON.parse(
    localStorage.getItem("avmp_projects") || "[]"
  );

  const container = $("saved");

  if (!projects.length) {
    container.textContent = "अभी कोई project save नहीं है।";
    return;
  }

  container.innerHTML = "";

  projects.forEach((project, index) => {
    const item = document.createElement("div");
    item.className = "saved-item";

    const title = document.createElement("b");
    title.textContent = project.topic;

    const date = document.createElement("small");
    date.textContent = project.date;

    const open = document.createElement("button");
    open.textContent = "Open";
    open.onclick = () => {
      $("topic").value = project.topic;
      $("output").value = project.output;
      $("status").textContent = "Saved Project";
    };

    const remove = document.createElement("button");
    remove.textContent = "Delete";
    remove.onclick = () => {
      const updated = projects.filter((_, i) => i !== index);
      localStorage.setItem("avmp_projects", JSON.stringify(updated));
      showProjects();
    };

    item.append(title, document.createElement("br"), date,
      document.createElement("br"), open, remove);

    container.appendChild(item);
  });
}

async function copyPrompt() {
  const output = $("output").value;

  if (!output) {
    alert("पहले Prompt बनाइए।");
    return;
  }

  try {
    await navigator.clipboard.writeText(output);
    alert("Prompt copied!");
  } catch {
    $("output").focus();
    $("output").select();
    alert("अब Copy दबाइए।");
  }
}

function downloadPrompt() {
  const output = $("output").value;

  if (!output) {
    alert("पहले Prompt बनाइए।");
    return;
  }

  const blob = new Blob([output], {
    type: "text/plain;charset=utf-8"
  });

  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = url;
  link.download = "AI-Video-Maker-Prompt.txt";
  link.click();

  URL.revokeObjectURL(url);
}

$("build").addEventListener("click", buildPrompt);
$("save").addEventListener("click", saveProject);
$("copy").addEventListener("click", copyPrompt);
$("download").addEventListener("click", downloadPrompt);

showProjects();
