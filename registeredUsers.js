```javascript
// ==========================================
// SUPABASE
// ==========================================

const SUPABASE_URL =
  "https://zpckuqwmoafyxuasosqh.supabase.co";

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

    auths = data.map(
      account => ({

        id: account.id,

        username: account.username,

        password: account.password,

        server: account.server,

        displayName: account.name

      })
    );

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

  const authList =
    document.getElementById("auths-list");

  if (!authList) {
    return;
  }

  authList.innerHTML = "";

  // ========================================
  // TẠO TABLE
  // ========================================

  const table =
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

  const headers =
    table.createTHead().insertRow();

  const nameHeader =
    headers.insertCell();

  nameHeader.textContent =
    "name";

  const serverHeader =
    headers.insertCell();

  serverHeader.textContent =
    "server";

  const pageHeader =
    headers.insertCell();

  pageHeader.textContent =
    "auto page";

  // ========================================
  // DANH SÁCH ACCOUNT
  // ========================================

  auths.forEach(
    (auth, index) => {

      const row =
        table.insertRow();

      // ====================================
      // NAME
      // ====================================

      const nameCell =
        row.insertCell();

      nameCell.textContent =
        auth.displayName;

      // ====================================
      // SERVER
      // ====================================

      const serverCell =
        row.insertCell();

      serverCell.textContent =
        auth.server;

      // ====================================
      // BUTTONS
      // ====================================

      const pageCell =
        row.insertCell();

      // ====================================
      // OPEN
      // ====================================

      const button =
        document.createElement(
          "button"
        );

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

      pageCell.appendChild(
        button
      );

      // ====================================
      // EDIT
      // ====================================

      const editUser =
        document.createElement(
          "button"
        );

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

      pageCell.appendChild(
        editUser
      );

      // ====================================
      // WEB VERSION
      // ====================================

      const webVersion =
        document.createElement(
          "button"
        );

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

      pageCell.appendChild(
        webVersion
      );

      // ====================================
      // UP
      // ====================================

      const moveUpButton =
        document.createElement(
          "button"
        );

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
            ] = [
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

      pageCell.appendChild(
        moveUpButton
      );

      // ====================================
      // DOWN
      // ====================================

      const moveDownButton =
        document.createElement(
          "button"
        );

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
            ] = [
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
        moveDownButton
      );

    }
  );

  // ========================================
  // ĐƯA TABLE VÀO TRANG
  // ========================================

  authList.appendChild(
    table
  );

  // ========================================
  // SEARCH
  // ========================================

  const searchInput =
    document.getElementById(
      "search-input"
    );

  if (searchInput) {

    const newSearchInput =
      searchInput.cloneNode(true);

    searchInput.parentNode.replaceChild(
      newSearchInput,
      searchInput
    );

    newSearchInput.addEventListener(
      "input",
      () => {

        const filter =
          newSearchInput.value.toUpperCase();

        const rows =
          table.getElementsByTagName(
            "tr"
          );

        for (
          let i = 1;
          i < rows.length;
          i++
        ) {

          const cells =
            rows[i].getElementsByTagName(
              "td"
            );

          let visible =
            false;

          for (
            let j = 0;
            j < cells.length;
            j++
          ) {

            const cell =
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
```
