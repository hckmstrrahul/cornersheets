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
    document.getElementById('closeSheetBtn').addEventListener('click', this.closeSheet.bind(this));
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

      // Check if the sheet is snapped to the left edge
      if (this.sheet.style.left === '0px') {
        if (e.offsetX <= 10) {
          // Transition back to cornersheet
          this.transitionToCornerSheet(e);
        } else {
          // Allow vertical resizing for bottomsheet
          this.isBottomSheetResizing = true;
        }
      }
    }
  }

  drag(e) {
    if (!this.isDragging) return;

    const deltaX = this.startX - e.clientX;
    const deltaY = this.startY - e.clientY;

    if (this.isBottomSheetResizing) {
      let newHeight = Math.max(this.minHeight, Math.min(this.startHeight + deltaY, window.innerHeight));
      this.sheet.style.height = `${newHeight}px`;
      this.updateScrimOpacity();
    } else {
      let newWidth = Math.max(this.minWidth, Math.min(this.startWidth + deltaX, window.innerWidth));
      let newHeight = Math.max(this.minHeight, Math.min(this.startHeight + deltaY, window.innerHeight));

      const sheetRight = Math.max(0, window.innerWidth - newWidth);

      if (sheetRight <= 10) {
        this.snapToLeftEdge();
      } else {
        this.sheet.style.width = `${newWidth}px`;
        this.sheet.style.height = `${newHeight}px`;
        this.sheet.style.right = '0';
        this.sheet.style.bottom = '0';
        this.sheet.style.left = 'auto';
        this.sheet.style.top = 'auto';
        this.updateScrimOpacity();
      }
    }
  }

  stopDragging() {
    this.isDragging = false;
  }

  updateScrimOpacity() {
    const rect = this.sheet.getBoundingClientRect();
    const sheetWidth = rect.width;
    const sheetHeight = rect.height;

    const widthRatio = Math.min((sheetWidth - this.minWidth) / (this.maxWidth - this.minWidth), 1);
    const heightRatio = Math.min((sheetHeight - this.minHeight) / (this.maxHeight - this.minHeight), 1);

    const opacityRatio = (widthRatio + heightRatio) / 2;
    const opacity = 0.01 + opacityRatio * 0.79; // 0.01 (1%) to 0.8 (80%)

    this.scrim.style.opacity = opacity.toFixed(2);
    this.scrim.style.pointerEvents = opacityRatio > 0 ? 'auto' : 'none';
  }

  snapToLeftEdge() {
    this.sheet.style.width = '100%';
    this.sheet.style.height = `${this.sheet.offsetHeight}px`;
    this.sheet.style.left = '0';
    this.sheet.style.right = 'auto';
    this.updateScrimOpacity();
  }

  transitionToCornerSheet(e) {
    const newWidth = window.innerWidth - e.clientX;
    this.sheet.style.width = `${newWidth}px`;
    this.sheet.style.left = 'auto';
    this.sheet.style.right = '0';
    this.updateScrimOpacity();
  }

  open() {
    this.sheet.style.width = `${this.minWidth}px`;
    this.sheet.style.height = `${this.minHeight}px`;
    this.sheet.style.right = '0';
    this.sheet.style.left = 'auto';
    this.container.style.display = 'block';
    this.updateScrimOpacity();
  }

  closeSheet() {
    this.container.style.display = 'none';
    this.sheet.style.width = `${this.minWidth}px`;
    this.sheet.style.height = `${this.minHeight}px`;
    this.resetPosition();
    this.updateScrimOpacity();
  }
}

const cornerSheet = new CornerSheet();

document.getElementById('openSheetBtn').addEventListener('click', () => {
  cornerSheet.open();
});
