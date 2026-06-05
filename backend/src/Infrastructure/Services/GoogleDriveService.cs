using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using Google.Apis.Auth.OAuth2;
using Google.Apis.Drive.v3;
using Google.Apis.Drive.v3.Data;
using Google.Apis.Services;
using Microsoft.Extensions.Configuration;
using Phantomhive.Application.Common.Interfaces;

namespace Phantomhive.Infrastructure.Services
{
    public class GoogleDriveService : IGoogleDriveService
    {
        private readonly DriveService _driveService;
        private readonly string _rootFolderId;

        public GoogleDriveService(IConfiguration configuration)
        {
            var credentialPath = configuration["GoogleDrive:CredentialFilePath"] ?? "google-credentials.json";
            _rootFolderId = configuration["GoogleDrive:RootFolderId"] ?? string.Empty;

            if (string.IsNullOrEmpty(_rootFolderId))
            {
                throw new InvalidOperationException("GoogleDrive:RootFolderId must be configured in appsettings.");
            }

            // Resolve relative paths safely. Check local execution directory, then fallback to WebApi project directory if needed.
            string actualPath = credentialPath;
            if (!Path.IsPathRooted(actualPath))
            {
                // check execution directory
                actualPath = Path.Combine(AppDomain.CurrentDomain.BaseDirectory, credentialPath);
                if (!System.IO.File.Exists(actualPath))
                {
                    // check current working directory
                    actualPath = Path.GetFullPath(credentialPath);
                }
            }

            GoogleCredential credential;
            if (System.IO.File.Exists(actualPath))
            {
#pragma warning disable CS0618
                var json = System.IO.File.ReadAllText(actualPath);
                credential = GoogleCredential.FromJson(json)
                    .CreateScoped(DriveService.Scope.Drive);
#pragma warning restore CS0618
            }
            else
            {
                // Fallback to Application Default Credentials when running in Cloud Run
                credential = GoogleCredential.GetApplicationDefault()
                    .CreateScoped(DriveService.Scope.Drive);
            }

            _driveService = new DriveService(new BaseClientService.Initializer
            {
                HttpClientInitializer = credential,
                ApplicationName = "Phantomhive Image Gallery"
            });
        }

        public async Task<IEnumerable<GoogleDriveItemDto>> ListFolderAsync(string? folderId)
        {
            var parentId = string.IsNullOrEmpty(folderId) ? _rootFolderId : folderId;
            var request = _driveService.Files.List();
            
            // Filter by parent, not trashed, and restrict to folders and image mimeTypes
            request.Q = $"'{parentId}' in parents and trashed = false and (mimeType = 'application/vnd.google-apps.folder' or mimeType starts with 'image/')";
            request.Fields = "files(id, name, mimeType, thumbnailLink, webViewLink, webContentLink, size, parents)";
            request.PageSize = 1000;

            var result = await request.ExecuteAsync();

            return result.Files.Select(file => new GoogleDriveItemDto
            {
                Id = file.Id,
                Name = file.Name,
                MimeType = file.MimeType,
                IsFolder = file.MimeType == "application/vnd.google-apps.folder",
                ThumbnailLink = file.ThumbnailLink,
                WebViewLink = file.WebViewLink,
                WebContentLink = file.WebContentLink,
                Size = file.Size,
                ParentId = file.Parents?.FirstOrDefault()
            });
        }

        public async Task<GoogleDriveItemDto> CreateFolderAsync(string name, string? parentFolderId)
        {
            var parentId = string.IsNullOrEmpty(parentFolderId) ? _rootFolderId : parentFolderId;
            var fileMetadata = new Google.Apis.Drive.v3.Data.File
            {
                Name = name,
                MimeType = "application/vnd.google-apps.folder",
                Parents = new List<string> { parentId }
            };

            var request = _driveService.Files.Create(fileMetadata);
            request.Fields = "id, name, mimeType, parents";
            var folder = await request.ExecuteAsync();

            return new GoogleDriveItemDto
            {
                Id = folder.Id,
                Name = folder.Name,
                MimeType = folder.MimeType,
                IsFolder = true,
                ParentId = folder.Parents?.FirstOrDefault()
            };
        }

        public async Task<GoogleDriveItemDto> UploadFileAsync(Stream fileStream, string fileName, string contentType, string? parentFolderId)
        {
            var parentId = string.IsNullOrEmpty(parentFolderId) ? _rootFolderId : parentFolderId;
            var fileMetadata = new Google.Apis.Drive.v3.Data.File
            {
                Name = fileName,
                Parents = new List<string> { parentId }
            };

            var request = _driveService.Files.Create(fileMetadata, fileStream, contentType);
            request.Fields = "id, name, mimeType, thumbnailLink, webViewLink, webContentLink, size, parents";
            
            var progress = await request.UploadAsync();
            if (progress.Status == Google.Apis.Upload.UploadStatus.Failed)
            {
                throw new InvalidOperationException($"Upload failed: {progress.Exception?.Message}", progress.Exception);
            }

            var uploadedFile = request.ResponseBody;
            if (uploadedFile == null)
            {
                throw new InvalidOperationException("Upload response body was empty.");
            }

            return new GoogleDriveItemDto
            {
                Id = uploadedFile.Id,
                Name = uploadedFile.Name,
                MimeType = uploadedFile.MimeType,
                IsFolder = false,
                ThumbnailLink = uploadedFile.ThumbnailLink,
                WebViewLink = uploadedFile.WebViewLink,
                WebContentLink = uploadedFile.WebContentLink,
                Size = uploadedFile.Size,
                ParentId = uploadedFile.Parents?.FirstOrDefault()
            };
        }

        public async Task<GoogleDriveItemDto> RenameItemAsync(string itemId, string newName)
        {
            var fileMetadata = new Google.Apis.Drive.v3.Data.File
            {
                Name = newName
            };

            var request = _driveService.Files.Update(fileMetadata, itemId);
            request.Fields = "id, name, mimeType, thumbnailLink, webViewLink, webContentLink, size, parents";
            var updatedFile = await request.ExecuteAsync();

            return new GoogleDriveItemDto
            {
                Id = updatedFile.Id,
                Name = updatedFile.Name,
                MimeType = updatedFile.MimeType,
                IsFolder = updatedFile.MimeType == "application/vnd.google-apps.folder",
                ThumbnailLink = updatedFile.ThumbnailLink,
                WebViewLink = updatedFile.WebViewLink,
                WebContentLink = updatedFile.WebContentLink,
                Size = updatedFile.Size,
                ParentId = updatedFile.Parents?.FirstOrDefault()
            };
        }

        public async Task<GoogleDriveItemDto> MoveItemsAsync(List<string> itemIds, string targetFolderId)
        {
            var targetId = string.IsNullOrEmpty(targetFolderId) ? _rootFolderId : targetFolderId;
            GoogleDriveItemDto lastItem = null!;

            foreach (var itemId in itemIds)
            {
                var getRequest = _driveService.Files.Get(itemId);
                getRequest.Fields = "id, parents";
                var file = await getRequest.ExecuteAsync();
                var previousParents = string.Join(",", file.Parents ?? new List<string>());

                var updateRequest = _driveService.Files.Update(new Google.Apis.Drive.v3.Data.File(), itemId);
                updateRequest.AddParents = targetId;
                if (!string.IsNullOrEmpty(previousParents))
                {
                    updateRequest.RemoveParents = previousParents;
                }
                updateRequest.Fields = "id, name, mimeType, thumbnailLink, webViewLink, webContentLink, size, parents";
                
                var updatedFile = await updateRequest.ExecuteAsync();
                lastItem = new GoogleDriveItemDto
                {
                    Id = updatedFile.Id,
                    Name = updatedFile.Name,
                    MimeType = updatedFile.MimeType,
                    IsFolder = updatedFile.MimeType == "application/vnd.google-apps.folder",
                    ThumbnailLink = updatedFile.ThumbnailLink,
                    WebViewLink = updatedFile.WebViewLink,
                    WebContentLink = updatedFile.WebContentLink,
                    Size = updatedFile.Size,
                    ParentId = updatedFile.Parents?.FirstOrDefault()
                };
            }

            return lastItem;
        }

        public async Task DeleteItemsAsync(List<string> itemIds)
        {
            foreach (var itemId in itemIds)
            {
                var fileMetadata = new Google.Apis.Drive.v3.Data.File
                {
                    Trashed = true
                };

                var request = _driveService.Files.Update(fileMetadata, itemId);
                await request.ExecuteAsync();
            }
        }
    }
}
