let uploadedPhotos = [];

document.addEventListener("DOMContentLoaded", () => {
  renderMetrics();
  renderInventoryTable();
});

function getProducts() {
  return JSON.parse(localStorage.getItem("angaworld_products")) || INITIAL_PRODUCTS;
}

function saveProducts(prods) {
  localStorage.setItem("angaworld_products", JSON.stringify(prods));
  renderMetrics();
  renderInventoryTable();
}

function renderMetrics() {
  const prods = getProducts();
  const totalUnits = prods.reduce((sum, p) => sum + Number(p.stockQty || p.stock || 0), 0);
  const totalVal = prods.reduce((sum, p) => sum + (Number(p.price || 0) * Number(p.stockQty || p.stock || 0)), 0);

  document.getElementById("statTotalAdmin").innerText = prods.length;
  document.getElementById("statStockAdmin").innerText = totalUnits.toLocaleString("en-IN");
  document.getElementById("statValuationAdmin").innerText = "₹" + totalVal.toLocaleString("en-IN");
}

function renderInventoryTable() {
  const prods = getProducts();
  const tbody = document.getElementById("adminInventoryTable");
  if (!tbody) return;

  tbody.innerHTML = prods.map((item, idx) => {
    const primaryImg = (item.images && item.images.length > 0) ? item.images[0] : "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=400&q=80";
    return `
      <tr>
        <td>
          <img src="${primaryImg}" class="table-img" alt="${item.title}" onerror="this.src='https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=100&q=80'" />
        </td>
        <td>
          <strong style="color: var(--text-primary);">${item.title}</strong>
          <div style="font-size: 11px; color: var(--text-secondary); margin-top: 2px;">📍 ${item.origin || 'Anga'} | ${item.images ? item.images.length : 1} photos</div>
        </td>
        <td>${item.category}</td>
        <td><strong>₹${Number(item.price).toLocaleString("en-IN")}</strong></td>
        <td><span class="badge-stock">${item.stockQty || item.stock || 10} Units</span></td>
        <td>
          <button class="btn-del" onclick="deleteProduct(${idx})">Delete</button>
        </td>
      </tr>
    `;
  }).join('');
}

function handleFileSelect(event) {
  const files = event.target.files;
  if (!files || !files.length) return;

  const remainingSlots = 5 - uploadedPhotos.length;
  if (remainingSlots <= 0) {
    alert("Maximum of 5 photos reached. Remove one before adding more.");
    return;
  }

  const filesToProcess = Array.from(files).slice(0, remainingSlots);

  filesToProcess.forEach(file => {
    const reader = new FileReader();
    reader.onload = function(e) {
      const img = new Image();
      img.onload = function() {
        const canvas = document.createElement("canvas");
        const TARGET_SIZE = 800;
        canvas.width = TARGET_SIZE;
        canvas.height = TARGET_SIZE;
        const ctx = canvas.getContext("2d");

        ctx.fillStyle = "#FFFFFF";
        ctx.fillRect(0, 0, TARGET_SIZE, TARGET_SIZE);

        let srcX = 0, srcY = 0, srcW = img.width, srcH = img.height;
        if (img.width > img.height) {
          srcX = (img.width - img.height) / 2;
          srcW = img.height;
        } else {
          srcY = (img.height - img.width) / 2;
          srcH = img.width;
        }

        ctx.drawImage(img, srcX, srcY, srcW, srcH, 0, 0, TARGET_SIZE, TARGET_SIZE);
        const normalizedDataUrl = canvas.toDataURL("image/jpeg", 0.88);
        if (uploadedPhotos.length < 5) {
          uploadedPhotos.push(normalizedDataUrl);
          updatePreviewGrid();
        }
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  });

  event.target.value = "";
}

function addUrlImage() {
  const input = document.getElementById("admExternalUrl");
  const url = input.value.trim();
  if (!url) return;

  if (uploadedPhotos.length >= 5) {
    alert("Maximum of 5 photos reached.");
    return;
  }

  uploadedPhotos.push(url);
  input.value = "";
  updatePreviewGrid();
}

function updatePreviewGrid() {
  const grid = document.getElementById("imagePreviewGrid");
  grid.innerHTML = uploadedPhotos.map((url, idx) => `
    <div class="preview-thumb-box">
      <img src="${url}" alt="Product Photo ${idx+1}" />
      <button type="button" class="remove-thumb-btn" onclick="removePhoto(${idx})">✕</button>
    </div>

  `).join('');
}

function removePhoto(idx) {
  uploadedPhotos.splice(idx, 1);
  updatePreviewGrid();
}

function previewVideo(url) {
  const box = document.getElementById("videoPreviewBox");
  const player = document.getElementById("videoPreviewPlayer");
  if (url && (url.endsWith(".mp4") || url.endsWith(".webm") || url.includes("video"))) {
    box.style.display = "block";
    player.src = url;
  } else {
    box.style.display = "none";
  }
}

function handleProductUpload(e) {
  e.preventDefault();

  if (uploadedPhotos.length === 0) {
    alert("Please upload at least 1 product photo.");
    return;
  }

  const prods = getProducts();
  const price = Number(document.getElementById("admPrice").value);
  const mrp = Number(document.getElementById("admMrp").value) || Math.round(price * 1.35);
  const discountPct = Math.round(((mrp - price) / mrp) * 100) + "% off";

  const newProduct = {
    id: "AW-" + Date.now().toString().slice(-4),
    title: document.getElementById("admTitle").value.trim(),
    brand: "Anga Artisans Guild",
    category: document.getElementById("admCategory").value,
    origin: document.getElementById("admOrigin").value.trim(),
    rating: 4.9,
    reviewsCount: 1,
    price: price,
    mrp: mrp,
    discount: discountPct,
    primeEligible: true,
    inStock: true,
    stockQty: Number(document.getElementById("admStock").value),
    images: [...uploadedPhotos],
    videoUrl: document.getElementById("admVideoUrl").value.trim(),
    description: document.getElementById("admDesc").value.trim()
  };

  prods.unshift(newProduct);
  saveProducts(prods);

  document.getElementById("adminUploadForm").reset();
  uploadedPhotos = [];
  updatePreviewGrid();
  document.getElementById("videoPreviewBox").style.display = "none";

  alert("✓ Product uploaded successfully! It is now live on the storefront with uniform 800x800 dimensions.");
  window.location.hash = "inventory-section";
}

function deleteProduct(index) {
  if (confirm("Are you sure you want to delete this product from AngaWorld catalog?")) {
    const prods = getProducts();
    prods.splice(index, 1);
    saveProducts(prods);
  }
}