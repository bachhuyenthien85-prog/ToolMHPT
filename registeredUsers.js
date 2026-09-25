```javascript
// ==========================================
// SUPABASE
// ==========================================

const SUPABASE_URL =
  "https://zpckuqwmoafyxuasosqh.supabase.co";

// Publishable / Anon key
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

async function ```javascript
async function loadAuths() {

  console.log("=== BẮT ĐẦU LOAD AUTHS ===");

  try {

    const { data, error } =
      await supabaseClient
        .from("auths")
        .select("*")
        .order("created_at", {
          ascending: true
        });

    console.log("DATA:", data);
    console.log("ERROR:", error);

    if (error) {

      console.error(
        "Lỗi Supabase:",
        error
      );

      alert(
        "Lỗi Supabase:\n\n" +
        error.message
      );

      return;
    }

    if (!data || data.length === 0) {

      console.warn(
        "Supabase trả về 0 tài khoản."
      );

      alert(
        "Supabase không trả về tài khoản nào."
      );

      return;
    }

    // Chuyển dữ liệu
    auths = data.map(account => ({

      id: account.id,

      username: account.username,

      password: account.password,

      server: account.server,

      displayName: account.name

    }));

    console.log(
      "AUTHS SAU KHI MAP:",
      auths
    );

    // Lưu local
    localStorage.setItem(
      "auths",
      JSON.stringify(auths)
    );

    // Hiển thị
    displayAuths();

  } catch (error) {

    console.error(
      "EXCEPTION:",
      error
    );

    alert(
      "Lỗi JavaScript:\n\n" +
      error.message
    );

  }

}
```


  try {

    // ========================================
    // QUAN TRỌNG:
    // KHÔNG lấy password
    // ========================================

    const { data, error } =
      await supabaseClient
        .from("auths")
        .select(
          "id, username, server, name, created_at"
        )
        .order("created_at", {
          ascending: true
        });


    if (error) {

      console.error(
        "Lỗi Supabase:",
        error
      );

      // Nếu Supabase lỗi thì dùng dữ liệu
      // localStorage hiện có.
      //
      // Tuy nhiên dữ liệu cũ có thể vẫn chứa password,
      // nên loại bỏ password trước khi sử dụng.

      const localData =
        JSON.parse(
          window.localStorage.getItem("auths")
        ) || [];

      auths = localData.map(account => ({
        id: account.id,
        username: account.username,
        server: account.server,
        displayName: account.displayName
      }));

      // Ghi đè localStorage bằng dữ liệu
      // KHÔNG có password.
      window.localStorage.setItem(
        "auths",
        JSON.stringify(auths)
      );

      displayAuths();

      alert(
        "Không tải được danh sách từ Supabase.\n\n" +
        error.message
      );

      return;
    }


    // ========================================
    // Chuyển dữ liệu Supabase
    // KHÔNG chứa password
    // ========================================

    auths = data.map(account => ({

      id: account.id,

      username: account.username,

      server: account.server,

      displayName: account.name

    }));


    // ========================================
    // LƯU LOCALSTORAGE
    // KHÔNG CÓ PASSWORD
    // ========================================

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


    // ========================================
    // FALLBACK LOCALSTORAGE
    // ========================================

    const localData =
      JSON.parse(
        window.localStorage.getItem("auths")
      ) || [];


    // Loại bỏ password khỏi dữ liệu cũ
    auths = localData.map(account => ({

      id: account.id,

      username: account.username,

      server: account.server,

      displayName: account.displayName

    }));


    // Ghi lại localStorage sạch
    window.localStorage.setItem(
      "auths",
      JSON.stringify(auths)
    );


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

  auths.forEach((auth, index) => {

    const row =
      table.insertRow();


    // ======================================
    // NAME
    // ======================================

    const nameCell =
      row.insertCell();

    nameCell.textContent =
      auth.displayName || "";


    // ======================================
    // SERVER
    // ======================================

    const serverCell =
      row.insertCell();

    serverCell.textContent =
      auth.server || "";


    // ======================================
    // BUTTONS
    // ======================================

    const pageCell =
      row.insertCell();


    // ======================================
    // OPEN
    // ======================================

    const button =
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

    const editUser =
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

    const webVersion =
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

        // ==================================
        // KHÔNG CÒN auth.password Ở CLIENT
        // ==================================
        //
        // Password phải được xử lý ở server/
        // Edge Function nếu muốn bảo mật.
        //

        alert(
          "Chức năng webVersion cần được chuyển sang xử lý phía server để không làm lộ password."
        );

      }
    );

    pageCell.appendChild(webVersion);


    // ======================================
    // UP
    // ======================================

    const moveUpButton =
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

    const moveDownButton =
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

  const searchInput =
    document.getElementById(
      "search-input"
    );


  if (searchInput) {

    // Xóa listener cũ
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
          table.getElementsByTagName("tr");


        for (
          let i = 1;
          i < rows.length;
          i++
        ) {

          const cells =
            rows[i].getElementsByTagName(
              "td"
            );

          let visible = false;


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
