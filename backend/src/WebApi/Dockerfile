FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
WORKDIR /src

# Copy project files and restore dependencies
COPY src/Domain/Phantomhive.Domain.csproj src/Domain/
COPY src/Application/Phantomhive.Application.csproj src/Application/
COPY src/Infrastructure/Phantomhive.Infrastructure.csproj src/Infrastructure/
COPY src/WebApi/Phantomhive.WebApi.csproj src/WebApi/
RUN dotnet restore src/WebApi/Phantomhive.WebApi.csproj

# Copy all source files and publish the release build
COPY src/ src/
RUN dotnet publish src/WebApi/Phantomhive.WebApi.csproj -c Release -o /app/publish

# Use the runtime ASP.NET 10.0 base image for execution
FROM mcr.microsoft.com/dotnet/aspnet:10.0 AS runtime
WORKDIR /app
COPY --from=build /app/publish .

# Expose port 8080 (Cloud Run default) and configure ASP.NET Core URL
EXPOSE 8080
ENV ASPNETCORE_URLS=http://+:8080

ENTRYPOINT ["dotnet", "Phantomhive.WebApi.dll"]
