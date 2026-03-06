const { Model } = require("objection");

class BaseModel extends Model {
  // here's where I add the modifier to filter out the soft-deleted data
  static get modifiers() {
    return {
      // return the ones that have not been deleted
      notDeleted(builder) {
        builder.whereNull(`${this.tableName}.deleted_at`);
      },
    };
  }
  // here, I implement a global filter using onBuild so I don't have to add the notDeleted modifier to every query
  static query(...args) {
    return super.query(...args).onBuild((builder) => {
      // If we don't explicitly call .context({includeDeleted: true}), then we filter out soft-deleted records.
      if (!builder.context().includeDeleted) {
        builder.whereNull(`${this.tableName}.deleted_at`);
      }
    });
  }

  // here's a method to perform a soft delete instead of a hard one.
  async $softDelete() {
    return this.$query().patch({
      deleted_at: new Date().toISOString(),
    });
  }

  // this logic makes sure 'id' is never sent in an update preventing an accidental primary key change during a patch.
  $beforeUpdate(opt, queryContext) {
    // super here calls the original code from objection before running my custom code so that we don't break inherited functionality
    super.$beforeUpdate(opt, queryContext);

    // Never allow the ID to be patched.
    if (this.id) {
      delete this.id;
    }
  }
}

module.exports = BaseModel;
