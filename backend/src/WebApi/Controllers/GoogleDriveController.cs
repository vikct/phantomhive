using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Phantomhive.Application.Common.Interfaces;

namespace Phantomhive.WebApi.Controllers
{
    [ApiController]
    [Route("api/gallery")]
    public class GoogleDriveController : ControllerBase
    {
        private readonly IGoogleDriveService _driveService;

        public GoogleDriveController(IGoogleDriveService driveService)
        {
            _driveService = driveService;
        }

        [HttpGet("list")]
        public async Task<IActionResult> ListFolder([FromQuery] string? folderId)
        {
            try
            {
                var items = await _driveService.ListFolderAsync(folderId);
                return Ok(items);
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, new { message = ex.Message });
            }
        }

        [HttpGet("file/{fileId}")]
        public async Task<IActionResult> DownloadFile(string fileId)
        {
            try
            {
                var (stream, contentType, fileName) = await _driveService.DownloadFileAsync(fileId);
                return File(stream, contentType, fileName);
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, new { message = ex.Message });
            }
        }

        [HttpPost("folder")]
        public async Task<IActionResult> CreateFolder([FromBody] CreateFolderRequest request)
        {
            if (string.IsNullOrWhiteSpace(request.Name))
            {
                return BadRequest(new { message = "Folder name is required." });
            }

            try
            {
                var folder = await _driveService.CreateFolderAsync(request.Name, request.ParentFolderId);
                return Ok(folder);
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, new { message = ex.Message });
            }
        }

        [HttpPost("upload")]
        public async Task<IActionResult> UploadFile([FromForm] IFormFile file, [FromForm] string? parentFolderId)
        {
            if (file == null || file.Length == 0)
            {
                return BadRequest(new { message = "File is required." });
            }

            try
            {
                using (var stream = file.OpenReadStream())
                {
                    var uploaded = await _driveService.UploadFileAsync(stream, file.FileName, file.ContentType, parentFolderId);
                    return Ok(uploaded);
                }
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, new { message = ex.Message });
            }
        }

        [HttpPut("rename/{itemId}")]
        public async Task<IActionResult> RenameItem(string itemId, [FromBody] RenameRequest request)
        {
            if (string.IsNullOrWhiteSpace(request.NewName))
            {
                return BadRequest(new { message = "New name is required." });
            }

            try
            {
                var updated = await _driveService.RenameItemAsync(itemId, request.NewName);
                return Ok(updated);
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, new { message = ex.Message });
            }
        }

        [HttpPost("move-batch")]
        public async Task<IActionResult> MoveItems([FromBody] MoveBatchRequest request)
        {
            if (request.ItemIds == null || request.ItemIds.Count == 0)
            {
                return BadRequest(new { message = "Item IDs are required." });
            }

            try
            {
                var lastUpdated = await _driveService.MoveItemsAsync(request.ItemIds, request.TargetFolderId);
                return Ok(lastUpdated);
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, new { message = ex.Message });
            }
        }

        [HttpPost("delete-batch")]
        public async Task<IActionResult> DeleteItems([FromBody] DeleteBatchRequest request)
        {
            if (request.ItemIds == null || request.ItemIds.Count == 0)
            {
                return BadRequest(new { message = "Item IDs are required." });
            }

            try
            {
                await _driveService.DeleteItemsAsync(request.ItemIds);
                return Ok(new { message = "Items successfully moved to trash." });
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, new { message = ex.Message });
            }
        }
    }

    public class CreateFolderRequest
    {
        public string Name { get; set; } = string.Empty;
        public string? ParentFolderId { get; set; }
    }

    public class RenameRequest
    {
        public string NewName { get; set; } = string.Empty;
    }

    public class MoveBatchRequest
    {
        public List<string> ItemIds { get; set; } = new();
        public string TargetFolderId { get; set; } = string.Empty;
    }

    public class DeleteBatchRequest
    {
        public List<string> ItemIds { get; set; } = new();
    }
}
