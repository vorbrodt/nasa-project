// pagination logic

const DEFAULT_PAGE_LIMIT = 0;
const DEFAULT_PAGE_NUMBER = 1;

function getPagination(query){
  // if value not defined use DEFAULT_PAGE_LIMIT, where mongoDB will return all documents in the collection on limit 0
  const limit = Math.abs(query.limit) || DEFAULT_PAGE_LIMIT;
  const page = Math.abs(query.page) || DEFAULT_PAGE_NUMBER;
  const skip = (page - 1) * limit;

  return {
    skip,
    limit
  }
}

module.exports = {
  getPagination,
}