let data = JSON.parse(localStorage.getItem("taskData")) || [];
let sortMode = "added_new";
let nextCategoryOrder = 0;

function initData() {
  data.forEach((category, index) => {
    if (category.order === undefined) {
      category.order = index;
    }
    if (category.order >= nextCategoryOrder) {
      nextCategoryOrder = category.order + 1;
    }
  });
}

initData();

function save() {
  localStorage.setItem("taskData", JSON.stringify(data));
}

function addCategory() {
  const input = document.getElementById("categoryInput");

  if (input.value.trim() === "") return;

  data.push({
    name: input.value,
    tasks: [],
    order: nextCategoryOrder++,
  });

  input.value = "";
  save();
  render();
}

function render() {
  const container = document.getElementById("categories");
  container.innerHTML = "";

  const categories = [...data];
  categories.sort((a, b) => {
    if (sortMode === "name") {
      return a.name.localeCompare(b.name, "ja");
    }
    if (sortMode === "added_old") {
      return a.order - b.order;
    }
    return b.order - a.order;
  });

  categories.forEach((category) => {
    const categoryIndex = data.indexOf(category);
    if (categoryIndex === -1) return;

    const categoryDiv = document.createElement("div");
    categoryDiv.className = "category";

    const header = document.createElement("div");
    header.className = "category-header";

    const title = document.createElement("h2");
    title.textContent = category.name;
    header.appendChild(title);

    const deleteCategoryButton = document.createElement("button");
    deleteCategoryButton.textContent = "削除";
    deleteCategoryButton.className = "delete-category";
    deleteCategoryButton.onclick = () => {
      data.splice(categoryIndex, 1);
      save();
      render();
    };

    header.appendChild(deleteCategoryButton);
    categoryDiv.appendChild(header);

    const taskInput = document.createElement("input");
    taskInput.placeholder = "タスク名";

    const addButton = document.createElement("button");
    addButton.textContent = "追加";

    addButton.onclick = () => {
      if (taskInput.value.trim() === "") return;

      category.tasks.push({
        text: taskInput.value,
        done: false,
      });

      save();
      render();
    };

    categoryDiv.appendChild(taskInput);
    categoryDiv.appendChild(addButton);

    let categoryTotal = 0;
    let categoryDone = 0;

    category.tasks.forEach((task, taskIndex) => {
      categoryTotal++;

      if (task.done) {
        categoryDone++;
      }

      const taskDiv = document.createElement("div");
      taskDiv.className = "task";

      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.checked = task.done;

      checkbox.onchange = () => {
        task.done = checkbox.checked;
        save();
        render();
      };

      const text = document.createElement("span");
      text.textContent = task.text;

      if (task.done) {
        text.classList.add("completed");
      }
      const deleteButton = document.createElement("button");
      deleteButton.textContent = "削除";

      deleteButton.onclick = () => {
        category.tasks.splice(taskIndex, 1);
        save();
        render();
      };

      taskDiv.appendChild(checkbox);
      taskDiv.appendChild(text);
      taskDiv.appendChild(deleteButton);

      categoryDiv.appendChild(taskDiv);
    });

    const categoryProgress = document.createElement("div");
    categoryProgress.className = "category-progress";
    const categoryPercent =
      categoryTotal === 0
        ? 0
        : Math.round((categoryDone / categoryTotal) * 100);
    categoryProgress.textContent = `タスク進捗率: ${categoryPercent}% (${categoryDone}/${categoryTotal})`;
    categoryDiv.appendChild(categoryProgress);

    container.appendChild(categoryDiv);
  });

  const progress = document.createElement("div");
  progress.className = "progress";

  const categoryCount = data.length;
  const completedCategoryCount = data.filter((category) => {
    const tasks = category.tasks;
    return tasks.length > 0 && tasks.every((task) => task.done);
  }).length;

  const overallProgress =
    categoryCount === 0
      ? 0
      : Math.round((completedCategoryCount / categoryCount) * 100);
  progress.textContent = `全体進捗率: ${overallProgress}% (${completedCategoryCount}/${categoryCount})`;

  container.appendChild(progress);
}

function changeSortMode(mode) {
  sortMode = mode;
  render();
}

render();
