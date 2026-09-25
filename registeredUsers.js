// ==========================================
// SUPABASE
// ==========================================

const SUPABASE_URL =
  "https://zpckuqwmoafyxuasosqh.supabase.co";

// DÁN PUBLISHABLE / ANON KEY CỦA BẠN VÀO ĐÂY
const SUPABASE_KEY =
  "sb_publishable_HnjSpv04hKVpUcorErxSYA_T9O-SUFO";

const supabaseClient =
  window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_KEY
  );


// ==========================================
// DANH SÁCH AUTH
// ==========================================

let auths = [];

let authList =
  document.getElementById("auths-container");


// ==========================================
// LẤY TÀI KHOẢN TỪ SUPABASE
// ==========================================

async function loadAuths() {

  try {

    const { data, error } =
      await supabaseClient
        .from("auths")
        .select("*")
        .order("created_at", {
          ascending: true
        });


    if (error) {

      console.error(
        "Lỗi Supabase:",
        error
      );

      // Nếu Supabase lỗi thì dùng dữ liệu
      // localStorage hiện có
      auths =
        JSON.parse(
          window.localStorage.getItem("auths")
        ) || [];

      displayAuths();

      alert(
        "Không tải được danh sách từ Supabase.\n\n" +
        error.message
      );

      return;
    }


    // Chuyển dữ liệu Supabase về format
    // mà code cũ của ToolMHPT đang sử dụng
    auths = data.map(account => ({

      id: account.id,

      username: account.username,

      password: account.password,

      server: account.server,

      displayName: account.name

    }));


    // Lưu bản sao trên thiết bị
    // để các chức năng Auto hiện tại
    // vẫn tiếp tục sử dụng được
    window.localStorage.setItem(
      "auths",
      JSON.stringify(auths)
    );


    displayAuths();

  } catch (error) {

    console.error(
      "Lỗi khi kết nối Supabase:",
      error
    );

    auths =
      JSON.parse(
        window.localStorage.getItem("auths")
      ) || [];

    displayAuths();

  }

}


// ==========================================
// HIỂN THỊ DANH SÁCH
// ==========================================

function displayAuths() {

  let authList =
    document.getElementById("auths-list");

  if (!authList) {
    return;
  }

  authList.innerHTML = "";


  // ========================================
  // TẠO TABLE
  // ========================================

  let table =
    document.createElement("table");

  table.classList.add(
    "table",
    "table-bordered"
  );

  table.style.borderCollapse =
    "collapse";


  // ========================================
  // HEADER
  // ========================================

  let headers =
    table.createTHead().insertRow();


  let nameHeader =
    headers.insertCell();

  nameHeader.textContent =
    "name";


  let serverHeader =
    headers.insertCell();

  serverHeader.textContent =
    "server";


  let pageHeader =
    headers.insertCell();

  pageHeader.textContent =
    "auto page";


  // ========================================
  // DANH SÁCH ACCOUNT
  // ========================================

  auths.forEach((auth, index) => {

    let row =
      table.insertRow();


    // NAME
    let nameCell =
      row.insertCell();

    nameCell.textContent =
      auth.displayName;


    // SERVER
    let serverCell =
      row.insertCell();

    serverCell.textContent =
      auth.server;


    // BUTTONS
    let pageCell =
      row.insertCell();


    // ======================================
    // OPEN
    // ======================================

    let button =
      document.createElement("button");

    button.classList.add(
      "btn",
      "btn-primary"
    );

    button.textContent =
      "Open";

    button.addEventListener(
      "click",
      () => {

        window.open(
          `user.html?userIndex=${index}`,
          "_blank"
        );

      }
    );

    pageCell.appendChild(button);


    // ======================================
    // EDIT
    // ======================================

    let editUser =
      document.createElement("button");

    editUser.classList.add(
      "btn",
      "btn-primary",
      "mx-2"
    );

    editUser.textContent =
      "Edit";

    editUser.addEventListener(
      "click",
      () => {

        window.open(
          `edit.html?userIndex=${index}`,
          "_blank"
        );

      }
    );

    pageCell.appendChild(editUser);


    // ======================================
    // WEB VERSION
    // ======================================

    let webVersion =
      document.createElement("button");

    webVersion.classList.add(
      "btn",
      "btn-info",
      "mx-2"
    );

    webVersion.textContent =
      "webVersion";

    webVersion.addEventListener(
      "click",
      () => {

        webBrowser(
          auth.username,
          auth.password
        );

      }
    );

    pageCell.appendChild(webVersion);


    // ======================================
    // UP
    // ======================================

    let moveUpButton =
      document.createElement("button");

    moveUpButton.classList.add(
      "btn",
      "btn-success",
      "mx-2"
    );

    moveUpButton.textContent =
      "Up";

    moveUpButton.addEventListener(
      "click",
      () => {

        if (index > 0) {

          [
            auths[index],
            auths[index - 1]
          ] =
          [
            auths[index - 1],
            auths[index]
          ];


          window.localStorage.setItem(
            "auths",
            JSON.stringify(auths)
          );


          displayAuths();

        }

      }
    );


    // ======================================
    // DOWN
    // ======================================

    let moveDownButton =
      document.createElement("button");

    moveDownButton.classList.add(
      "btn",
      "btn-warning",
      "mx-2"
    );

    moveDownButton.textContent =
      "Down";

    moveDownButton.addEventListener(
      "click",
      () => {

        if (
          index <
          auths.length - 1
        ) {

          [
            auths[index],
            auths[index + 1]
          ] =
          [
            auths[index + 1],
            auths[index]
          ];


          window.localStorage.setItem(
            "auths",
            JSON.stringify(auths)
          );


          displayAuths();

        }

      }
    );


    pageCell.appendChild(
      moveUpButton
    );

    pageCell.appendChild(
      moveDownButton
    );

  });


  // ========================================
  // ĐƯA TABLE VÀO TRANG
  // ========================================

  authList.appendChild(table);


  // ========================================
  // SEARCH
  // ========================================

  let searchInput =
    document.getElementById(
      "search-input"
    );


  if (searchInput) {

    // Xóa listener cũ bằng cách clone
    // tránh bị đăng ký nhiều lần
    let newSearchInput =
      searchInput.cloneNode(true);

    searchInput.parentNode.replaceChild(
      newSearchInput,
      searchInput
    );


    newSearchInput.addEventListener(
      "input",
      () => {

        let filter =
          newSearchInput.value.toUpperCase();

        let rows =
          table.getElementsByTagName("tr");


        for (
          let i = 1;
          i < rows.length;
          i++
        ) {

          let cells =
            rows[i].getElementsByTagName(
              "td"
            );

          let visible = false;


          for (
            let j = 0;
            j < cells.length;
            j++
          ) {

            let cell =
              cells[j];

            if (
              cell.textContent
                .toUpperCase()
                .indexOf(filter) > -1
            ) {

              visible = true;
              break;

            }

          }


          rows[i].style.display =
            visible ? "" : "none";

        }

      }
    );

  }

}


// ==========================================
// CHẠY KHI MỞ LIST ACCOUNT
// ==========================================

loadAuths();
