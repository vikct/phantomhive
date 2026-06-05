using System.Collections.Generic;
using System.IO;
using System.Threading.Tasks;

namespace Phantomhive.Application.Common.Interfaces
{
    public interface IGoogleDriveService
    {
        Task<IEnumerable<GoogleDriveItemDto>> ListFolderAsync(string? folderId);
        Task<GoogleDriveItemDto> CreateFolderAsync(string name, string? parentFolderId);
        Task<GoogleDriveItemDto> UploadFileAsync(Stream fileStream, string fileName, string contentType, string? parentFolderId);
        Task<GoogleDriveItemDto> RenameItemAsync(string itemId, string newName);
        Task<GoogleDriveItemDto> MoveItemsAsync(List<string> itemIds, string targetFolderId);
        Task DeleteItemsAsync(List<string> itemIds);
        Task<(Stream Stream, string ContentType, string FileName)> DownloadFileAsync(string fileId);
    }

    public class GoogleDriveItemDto
    {
        public string Id { get; set; } = string.Empty;
        public string Name { get; set; } = string.Empty;
        public string MimeType { get; set; } = string.Empty;
        public bool IsFolder { get; set; }
        public string? ThumbnailLink { get; set; }
        public string? WebViewLink { get; set; }
        public string? WebContentLink { get; set; }
        public long? Size { get; set; }
        public string? ParentId { get; set; }
    }
}
