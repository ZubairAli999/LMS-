// model,populate

// high order function that returns another function
const advancedResults = (model, populate) => {
  // since req is here, we can use queries
  return async (req, res, next) => {
    let ModelQuery   = model.find(); // return all data via `query`, then do pagination using mongoose
    const page       = Number(req.query.page) || 1; // using number constructor, look for query params 'page'
    const limit      = Number(req.query.limit) || 2; // using number constructor, look for query params 'limit'
    const skip       = (page - 1) * limit; // page minus 1 times the limit
    const total      = await model.countDocuments(); // get total records
    const startIndex = (page - 1) * limit; // start index of the current page
    const endIndex   = page * limit; // end index of the current page

    // populate
    if(populate) {
        ModelQuery = ModelQuery.populate(populate);
    }

    // If the query string has the name property, search for the name
    if (req.query.name) {
      // filtering/searching by name
      ModelQuery = ModelQuery.find({
        name: { $regex: req.query.name, $options: "i" },
      });
    }

    // pagination results
    const pagination = {};
    // add next
    if (endIndex < total) {
      pagination.next = {
        page: page + 1,
        limit,
      };
    }
    // add prev
    if (startIndex > 0) {
      pagination.prev = {
        page: page - 1,
        limit,
      };
    }

    const AdvancedResults = await ModelQuery.find().skip(skip).limit(limit);

    res.results = {
        total,
        pagination,
        results: AdvancedResults.length,
        status: "success",
        message: "Advanced Results fetched successfully",
        data: AdvancedResults,
    }

    next();
  };
};

module.exports = advancedResults;
