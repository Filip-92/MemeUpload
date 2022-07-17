namespace API.Helpers
{
    public class MemeLikesParams : PaginationParams
    {
        public int MemeId { get; set; }
        public int UserId { get; set; }
        public string Predicate { get; set; }
    }
}