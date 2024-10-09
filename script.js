class CornerSheet {
  constructor() {
    this.container = document.querySelector('.corner-sheet-container');
    this.scrim = this.container.querySelector('.scrim');
    this.sheet = this.container.querySelector('.corner-sheet');
    this.dragHandle = this.sheet.querySelector('.drag-handle');

    this.isDragging = false;
    this.startX = 0;
    this.startY = 0;
    this.startWidth = 0;
    this.startHeight = 0;

    this.minWidth = 200;
    this.minHeight = 100;
    this.maxWidth = window.innerWidth * 0.9;
    this.maxHeight = window.innerHeight * 0.8;

    this.bindEvents();
  }

  bindEvents() {
    this.dragHandle.addEventListener('mousedown', this.startDragging.bind(this));
    this.sheet.addEventListener('mousedown', this.startResizing.bind(this));
    document.addEventListener('mousemove', this.drag.bind(this));
    document.addEventListener('mouseup', this.stopDragging.bind(this));
  }

  startDragging(e) {
    if (e.target === this.dragHandle) {
      this.isDragging = true;
      this.startX = e.clientX;
      this.startY = e.clientY;
      this.startWidth = this.sheet.offsetWidth;
      this.startHeight = this.sheet.offsetHeight;
    }
  }

  startResizing(e) {
    if (e.target !== this.dragHandle && (e.offsetY <= 10 || e.offsetX <= 10)) {
      this.isDragging = true;
      this.startX = e.clientX;
      this.startY = e.clientY;
      this.startWidth = this.sheet.offsetWidth;
      this.startHeight = this.sheet.offsetHeight;
    }
  }

  drag(e) {
    if (!this.isDragging) return;

    const deltaX = this.startX - e.clientX;
    const deltaY = this.startY - e.clientY;

    let newWidth = Math.max(this.minWidth, Math.min(this.startWidth + deltaX, this.maxWidth));
    let newHeight = Math.max(this.minHeight, Math.min(this.startHeight + deltaY, this.maxHeight));

    this.sheet.style.width = `${newWidth}px`;
    this.sheet.style.height = `${newHeight}px`;

    this.updateScrimOpacity(newWidth, newHeight);
  }

  stopDragging() {
    this.isDragging = false;
  }

  updateScrimOpacity(width, height) {
    const widthRatio = (width - this.minWidth) / (this.maxWidth - this.minWidth);
    const heightRatio = (height - this.minHeight) / (this.maxHeight - this.minHeight);
    const opacity = Math.max(widthRatio, heightRatio) * 0.8;
    this.scrim.style.opacity = opacity;
  }
}

const cornerSheet = new CornerSheet();
