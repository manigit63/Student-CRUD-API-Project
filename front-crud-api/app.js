// All main JS logic from index.html will be moved here
const apiUrl = "http://localhost:3000/api/students";
let currentPage = 1;
let currentSearch = "";

// find token function
function checkAuth() {
  const token = localStorage.getItem("token");
  if (!token) {
    window.location.href = "index.html"; //login page pe reditect id no token
  }
  return token;
}

const token = checkAuth();

// view all students
async function fetchStudents(search = "", page = 1) {
  currentPage = page;
  currentSearch = search;

  const res = await fetch(
    `${apiUrl}?search=${encodeURIComponent(search)}&page=${page}&limit=5`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  const data = await res.json();
  // console.log(data);

  const tbody = document.querySelector("#studentTableBody");
  tbody.innerHTML = "";

  if (Array.isArray(data.students) && data.students.length > 0) {
    data.students.forEach((student) => {
      tbody.innerHTML += `
    <tr>
        <td><img src="http://localhost:3000/uploads/${student.profile_pic}" width="50" height="50" class="rounded-circle" /></td>
        <td>${student.first_name}</td>
        <td>${student.last_name}</td>
        <td>${student.email}</td>
        <td>${student.phone}</td>
        <td>${student.gender}</td>
        <td>
          <button class="btn btn-info btn-sm" onclick="viewStudent('${student._id}')">View</button>
          <button class="btn btn-warning btn-sm" onclick="editStudent('${student._id}')">Edit</button>
          <button class="btn btn-danger btn-sm" onclick="deleteStudent('${student._id}')">Delete</button>
        </td>
      </tr>
`;
    });
  } else {
    tbody.innerHTML =
      '<tr><td colspan="7" class="text-center">No students found.</td></tr>';
  }

  renderPagination(data.totalpage, data.page);
}

fetchStudents();

// render pagination
function renderPagination(totalPage, currentPage) {
  const container = document.querySelector("#pagination");
  container.innerHTML = "";
  if (!totalPage || totalPage < 1) return;

  // Previous button
  const prevLi = document.createElement("li");
  prevLi.className = "page-item" + (currentPage === 1 ? " disabled" : "");
  const prevA = document.createElement("a");
  prevA.className = "page-link";
  prevA.href = "#";
  prevA.textContent = "Previous";
  prevA.addEventListener("click", (e) => {
    e.preventDefault();
    if (currentPage > 1) fetchStudents(currentSearch, currentPage - 1);
  });
  prevLi.appendChild(prevA);
  container.appendChild(prevLi);

  // Page number buttons
  for (let i = 1; i <= totalPage; i++) {
    const li = document.createElement("li");
    li.className = "page-item" + (i === currentPage ? " active" : "");
    const a = document.createElement("a");
    a.className = "page-link";
    a.href = "#";
    a.textContent = i;
    a.addEventListener("click", (e) => {
      e.preventDefault();
      if (i !== currentPage) fetchStudents(currentSearch, i);
    });
    li.appendChild(a);
    container.appendChild(li);
  }

  // Next button
  const nextLi = document.createElement("li");
  nextLi.className =
    "page-item" + (currentPage === totalPage ? " disabled" : "");
  nextLi.innerHTML = '<a class="page-link" href="#">Next</a>';
  if (currentPage < totalPage) {
    nextLi.querySelector("a").addEventListener("click", (e) => {
      e.preventDefault();
      fetchStudents(currentSearch, currentPage + 1);
    });
  }
  container.appendChild(nextLi);
}

// search logics
document.querySelector("#searchInput").addEventListener("input", () => {
  // window.currentPage = 1;
  fetchStudents(document.querySelector("#searchInput").value,1);
});

// view single student record using bootstrap
async function viewStudent(id) {
  const res = await fetch(`${apiUrl}/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  const student = await res.json();
  document.querySelector(
    "#viewProfilePic"
  ).src = `http://localhost:3000/uploads/${student.profile_pic}`;
  document.querySelector(
    "#viewName"
  ).textContent = `${student.first_name} ${student.last_name}`;
  document.querySelector("#viewEmail").textContent = student.email;
  document.querySelector("#viewPhone").textContent = student.phone;
  document.querySelector("#viewGender").textContent = student.gender;
  new bootstrap.Modal(document.querySelector("#viewStudentModal")).show();
}

// add new student
document
  .querySelector("#addStudentForm")
  .addEventListener("submit", async function (e) {
    e.preventDefault();
    const formData = new FormData(this);
    const res = await fetch(apiUrl, {
      method: "POST",
      body: formData,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (res.ok) {
      this.reset();
      bootstrap.Modal.getInstance(
        document.getElementById("addStudentModal")
      ).hide();
      fetchStudents();
    } else {
      alert("unable to create student");
    }
  });

// delete student
async function deleteStudent(id) {
  if (confirm("Are you sure to delete this student?")) {
    await fetch(`${apiUrl}/${id}`, {
      method: `DELETE`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    fetchStudents();
  }
}

// update / edit student form show
async function editStudent(id) {
  const res = await fetch(`${apiUrl}/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  const student = await res.json();
  document.querySelector("#editStudentId").value = student._id;
  document.querySelector("#editFirstName").value = student.first_name;
  document.querySelector("#editLastName").value = student.last_name;
  document.querySelector("#editEmail").value = student.email;
  document.querySelector("#editPhone").value = student.phone;
  document.querySelector("#editGender").value = student.gender;
  new bootstrap.Modal(document.querySelector("#editStudentModal")).show();
}

//  update  student record
document
  .querySelector("#editStudentForm")
  .addEventListener("submit", async function (e) {
    e.preventDefault();
    const id = document.querySelector("#editStudentId").value;
    const formData = new FormData(this);
    const res = await fetch(`${apiUrl}/${id}`, {
      method: "PUT",
      body: formData,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (res.ok) {
      bootstrap.Modal.getInstance(
        document.querySelector("#editStudentModal")
      ).hide();
      fetchStudents();
    } else {
      alert("Error while updating records, try again!");
    }
  });

// logout funtion
function Logout() {
  localStorage.removeItem("token");
  window.location.href = "index.html";
}
