using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace TaskManagerApp.Migrations
{
    /// <inheritdoc />
    public partial class UpdateExistingTasksWithDefaultValues : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            // Update existing tasks that have Priority = 0 (None) to Medium (2)
            migrationBuilder.Sql(@"
                UPDATE Tasks 
                SET Priority = 2 
                WHERE Priority = 0;
            ");

            // Update existing tasks that have Category = 0 (None) to Other (8)
            migrationBuilder.Sql(@"
                UPDATE Tasks 
                SET Category = 8 
                WHERE Category = 0;
            ");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            // Revert Priority changes: Set Medium (2) back to 0
            migrationBuilder.Sql(@"
                UPDATE Tasks 
                SET Priority = 0 
                WHERE Priority = 2;
            ");

            // Revert Category changes: Set Other (8) back to 0
            migrationBuilder.Sql(@"
                UPDATE Tasks 
                SET Category = 0 
                WHERE Category = 8;
            ");
        }
    }
}
