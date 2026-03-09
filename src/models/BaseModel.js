const { Model } = require("objection");
const { DbErrors } = require("objection-db-errors");

//wrapping BaseModel with DbErrors gives high-quality error types
class BaseModel extends DbErrors(Model) {
  // here's where I add the modifier to filter out the soft-deleted data
  static get modifiers() {
    return {
      // return the ones that have not been deleted
      notDeleted(builder) {
        builder.whereNull(`${this.tableName}.deletedAt`);
      },
    };
  }

  // here, I implement a global filter using onBuild so I don't have to add the notDeleted modifier to every query
  static query(...args) {
    return super.query(...args).onBuild((builder) => {
      // If I don't explicitly call .context({includeDeleted: true}), then I filter out soft-deleted records.
      if (!builder.context().includeDeleted) {
        builder.whereNull(`${this.tableName}.deletedAt`);
      }
    });
  }

  // here's a method to perform a soft delete instead of a hard one.
  async $softDelete() {
    return this.$query().patch({
      deletedAt: new Date().toISOString(),
    });
  }

  // this logic makes sure 'id' is never sent in an update preventing an accidental primary key change during a patch.
  $beforeUpdate(opt, queryContext) {
    // super here calls the original code from objection before running my custom code so that we don't break inherited functionality
    super.$beforeUpdate(opt, queryContext);

    // NEVER allow the ID to be patched.
    if (this.id) {
      delete this.id;
    }
  }

  // automatically format dates for MySQL
  $formatDatabaseJson(json) {
    // call the original implementation first
    json = super.$formatDatabaseJson(json);

    // convert ISO string to MySQL-friendly format: YYYY-MM-DD HH:mm:ss
    const dateFields = this.constructor.dateAttributes || [];

    dateFields.forEach((field) => {
      if (json[field]) {
        json[field] = new Date(json[field])
          .toISOString()
          .slice(0, 19)
          .replace("T", " ");
      }
    });

    return json;
  }
}

module.exports = BaseModel;
