import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '@env/environment';

export interface GalleryItem {
  id: string;
  name: string;
  mimeType: string;
  isFolder: boolean;
  thumbnailLink?: string;
  webViewLink?: string;
  webContentLink?: string;
  size?: number;
  parentId?: string;
}

@Injectable({
  providedIn: 'root',
})
export class GalleryService {
  private readonly API_URL = `${environment.apiUrl}/gallery`;
  private http = inject(HttpClient);

  listFolder(folderId?: string): Observable<GalleryItem[]> {
    const url = folderId ? `${this.API_URL}/list?folderId=${folderId}` : `${this.API_URL}/list`;
    return this.http.get<GalleryItem[]>(url);
  }

  createFolder(name: string, parentFolderId?: string): Observable<GalleryItem> {
    return this.http.post<GalleryItem>(`${this.API_URL}/folder`, {
      name,
      parentFolderId,
    });
  }

  uploadFile(file: File, parentFolderId?: string): Observable<GalleryItem> {
    const formData = new FormData();
    formData.append('file', file);
    if (parentFolderId) {
      formData.append('parentFolderId', parentFolderId);
    }
    return this.http.post<GalleryItem>(`${this.API_URL}/upload`, formData);
  }

  renameItem(itemId: string, newName: string): Observable<GalleryItem> {
    return this.http.put<GalleryItem>(`${this.API_URL}/rename/${itemId}`, {
      newName,
    });
  }

  moveItems(itemIds: string[], targetFolderId: string): Observable<GalleryItem> {
    return this.http.post<GalleryItem>(`${this.API_URL}/move-batch`, {
      itemIds,
      targetFolderId,
    });
  }

  deleteItems(itemIds: string[]): Observable<{ message: string }> {
    return this.http.post<{ message: string }>(`${this.API_URL}/delete-batch`, {
      itemIds,
    });
  }
}
