import { Component, OnInit, HostListener, signal, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { GalleryService, GalleryItem } from './gallery.service';

@Component({
  selector: 'app-gallery',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './gallery.component.html',
  styleUrls: ['./gallery.component.scss']
})
export class GalleryComponent implements OnInit {
  private galleryService = inject(GalleryService);

  items = signal<GalleryItem[]>([]);
  currentFolderId = signal<string | undefined>(undefined);
  breadcrumbs = signal<{ id: string; name: string }[]>([]);
  selectedItemIds = signal<Set<string>>(new Set());
  loading = signal<boolean>(false);
  error = signal<string | null>(null);

  // Lightbox
  lightboxActive = signal<boolean>(false);
  lightboxIndex = signal<number>(0);

  // Modals & Dialogs
  activeModal = signal<'createFolder' | 'rename' | 'move' | null>(null);
  newFolderName = '';
  itemToRename = signal<GalleryItem | null>(null);
  renamedName = '';

  // Move Modal State
  moveSelectedFolderId = signal<string | undefined>(undefined);
  moveFolderBreadcrumbs = signal<{ id: string; name: string }[]>([]);
  moveFoldersList = signal<GalleryItem[]>([]);
  moveLoading = signal<boolean>(false);
  itemToMove = signal<GalleryItem | null>(null); // null if batch move

  // Computed Properties
  folders = computed(() => this.items().filter(item => item.isFolder));
  images = computed(() => this.items().filter(item => !item.isFolder));
  
  lightboxImages = computed(() => this.images());

  isAllSelected = computed(() => {
    const list = this.items();
    if (list.length === 0) return false;
    return list.every(item => this.selectedItemIds().has(item.id));
  });

  isSomeSelected = computed(() => {
    const set = this.selectedItemIds();
    const list = this.items();
    return set.size > 0 && set.size < list.length;
  });

  ngOnInit() {
    this.breadcrumbs.set([{ id: '', name: 'Gallery Root' }]);
    this.loadFolderContents();
  }

  loadFolderContents() {
    this.loading.set(true);
    this.error.set(null);
    this.galleryService.listFolder(this.currentFolderId()).subscribe({
      next: (data) => {
        this.items.set(data);
        this.loading.set(false);
      },
      error: (err) => {
        console.error('Failed to load gallery items:', err);
        this.error.set('Failed to load items. Please verify your Google credentials and folder settings.');
        this.loading.set(false);
      }
    });
  }

  enterFolder(folder: GalleryItem) {
    this.breadcrumbs.update(crumbs => [...crumbs, { id: folder.id, name: folder.name }]);
    this.currentFolderId.set(folder.id);
    this.loadFolderContents();
    this.clearSelection();
  }

  navigateToBreadcrumb(idx: number) {
    this.breadcrumbs.update(crumbs => crumbs.slice(0, idx + 1));
    const targetId = this.breadcrumbs()[idx].id;
    this.currentFolderId.set(targetId ? targetId : undefined);
    this.loadFolderContents();
    this.clearSelection();
  }

  // Selection helpers
  toggleSelectAll() {
    if (this.isAllSelected()) {
      this.clearSelection();
    } else {
      const set = new Set(this.items().map(item => item.id));
      this.selectedItemIds.set(set);
    }
  }

  toggleSelectItem(item: GalleryItem, event: Event) {
    event.stopPropagation();
    const set = new Set(this.selectedItemIds());
    if (set.has(item.id)) {
      set.delete(item.id);
    } else {
      set.add(item.id);
    }
    this.selectedItemIds.set(set);
  }

  clearSelection() {
    this.selectedItemIds.set(new Set());
  }

  // File Upload
  triggerFileInput(fileInput: HTMLInputElement) {
    fileInput.click();
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      this.loading.set(true);
      this.galleryService.uploadFile(file, this.currentFolderId()).subscribe({
        next: () => {
          this.loadFolderContents();
          input.value = ''; // Reset file input
        },
        error: (err) => {
          console.error('Upload failed:', err);
          this.error.set('File upload failed. Please try again.');
          this.loading.set(false);
        }
      });
    }
  }

  // Create Folder
  openCreateFolderModal() {
    this.newFolderName = '';
    this.activeModal.set('createFolder');
  }

  submitCreateFolder() {
    if (!this.newFolderName.trim()) return;
    this.loading.set(true);
    this.activeModal.set(null);
    this.galleryService.createFolder(this.newFolderName.trim(), this.currentFolderId()).subscribe({
      next: () => {
        this.loadFolderContents();
      },
      error: (err) => {
        console.error('Folder creation failed:', err);
        this.error.set('Failed to create folder.');
        this.loading.set(false);
      }
    });
  }

  // Rename
  openRenameModal(item: GalleryItem, event?: Event) {
    if (event) event.stopPropagation();
    this.itemToRename.set(item);
    this.renamedName = item.name;
    this.activeModal.set('rename');
  }

  submitRename() {
    const item = this.itemToRename();
    if (!item || !this.renamedName.trim() || this.renamedName.trim() === item.name) {
      this.activeModal.set(null);
      return;
    }
    this.loading.set(true);
    this.activeModal.set(null);
    this.galleryService.renameItem(item.id, this.renamedName.trim()).subscribe({
      next: () => {
        this.loadFolderContents();
        this.itemToRename.set(null);
      },
      error: (err) => {
        console.error('Rename failed:', err);
        this.error.set('Failed to rename item.');
        this.loading.set(false);
      }
    });
  }

  // Delete/Trash
  deleteItem(item: GalleryItem, event?: Event) {
    if (event) event.stopPropagation();
    if (confirm(`Are you sure you want to move "${item.name}" to trash?`)) {
      this.loading.set(true);
      this.galleryService.deleteItems([item.id]).subscribe({
        next: () => {
          this.loadFolderContents();
        },
        error: (err) => {
          console.error('Delete failed:', err);
          this.error.set('Failed to delete item.');
          this.loading.set(false);
        }
      });
    }
  }

  deleteSelected() {
    const count = this.selectedItemIds().size;
    if (count === 0) return;
    if (confirm(`Are you sure you want to move the ${count} selected item(s) to trash?`)) {
      this.loading.set(true);
      this.galleryService.deleteItems(Array.from(this.selectedItemIds())).subscribe({
        next: () => {
          this.clearSelection();
          this.loadFolderContents();
        },
        error: (err) => {
          console.error('Batch delete failed:', err);
          this.error.set('Failed to delete selected items.');
          this.loading.set(false);
        }
      });
    }
  }

  // Move Modal Navigation & logic
  openMoveModal(item: GalleryItem | null, event?: Event) {
    if (event) event.stopPropagation();
    this.itemToMove.set(item);
    
    // Initialize move explorer at the current root
    this.moveSelectedFolderId.set(undefined);
    this.moveFolderBreadcrumbs.set([{ id: '', name: 'Gallery Root' }]);
    this.activeModal.set('move');
    this.loadMoveExplorerFolder();
  }

  loadMoveExplorerFolder() {
    this.moveLoading.set(true);
    this.galleryService.listFolder(this.moveSelectedFolderId()).subscribe({
      next: (data) => {
        // Only show folders in the move dialog target selection,
        // and filter out the folder itself to prevent cyclic moving if we are moving a folder!
        const movingItem = this.itemToMove();
        this.moveFoldersList.set(
          data.filter(item => 
            item.isFolder && 
            (!movingItem || item.id !== movingItem.id) &&
            (!this.selectedItemIds().has(item.id))
          )
        );
        this.moveLoading.set(false);
      },
      error: (err) => {
        console.error('Failed to load folders in move modal:', err);
        this.moveLoading.set(false);
      }
    });
  }

  navigateMoveExplorer(folder: GalleryItem) {
    this.moveFolderBreadcrumbs.update(crumbs => [...crumbs, { id: folder.id, name: folder.name }]);
    this.moveSelectedFolderId.set(folder.id);
    this.loadMoveExplorerFolder();
  }

  navigateMoveExplorerBreadcrumb(idx: number) {
    this.moveFolderBreadcrumbs.update(crumbs => crumbs.slice(0, idx + 1));
    const targetId = this.moveFolderBreadcrumbs()[idx].id;
    this.moveSelectedFolderId.set(targetId ? targetId : undefined);
    this.loadMoveExplorerFolder();
  }

  submitMove() {
    const targetFolderId = this.moveSelectedFolderId() || '';
    
    // Prevent moving to the current parent (which is a no-op)
    const currentParentId = this.currentFolderId() || '';
    if (targetFolderId === currentParentId) {
      this.activeModal.set(null);
      return;
    }

    const item = this.itemToMove();
    const itemIds = item ? [item.id] : Array.from(this.selectedItemIds());
    
    if (itemIds.length === 0) {
      this.activeModal.set(null);
      return;
    }

    this.loading.set(true);
    this.activeModal.set(null);
    this.galleryService.moveItems(itemIds, targetFolderId).subscribe({
      next: () => {
        this.clearSelection();
        this.loadFolderContents();
        this.itemToMove.set(null);
      },
      error: (err) => {
        console.error('Move failed:', err);
        this.error.set('Failed to move items.');
        this.loading.set(false);
      }
    });
  }

  // Lightbox Preview
  openLightbox(item: GalleryItem) {
    const idx = this.lightboxImages().findIndex(img => img.id === item.id);
    if (idx !== -1) {
      this.lightboxIndex.set(idx);
      this.lightboxActive.set(true);
    }
  }

  closeLightbox() {
    this.lightboxActive.set(false);
  }

  nextImage() {
    const total = this.lightboxImages().length;
    if (total === 0) return;
    this.lightboxIndex.update(idx => (idx + 1) % total);
  }

  prevImage() {
    const total = this.lightboxImages().length;
    if (total === 0) return;
    this.lightboxIndex.update(idx => (idx - 1 + total) % total);
  }

  // Keyboard controls listener
  @HostListener('document:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    if (this.lightboxActive()) {
      if (event.key === 'ArrowLeft') {
        this.prevImage();
      } else if (event.key === 'ArrowRight') {
        this.nextImage();
      } else if (event.key === 'Escape') {
        this.closeLightbox();
      }
    }
  }

  // Utilities
  formatBytes(bytes?: number, decimals = 2) {
    if (!bytes) return '0 Bytes';
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  }
}
