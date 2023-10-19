const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const AuthorSchema = new Schema({
  first_name: { type: String, required: true, maxLength: 100 },
  family_name: { type: String, required: true, maxLength: 100 },
  date_of_birth: { type: Date },
  date_of_death: { type: Date },
});

// Virtual for author's full name
AuthorSchema.virtual("name").get(function () {
  // To avoid errors in cases where an author does not have either a family name or first name
  // We want to make sure we handle the exception by returning an empty string for that case
  let fullname = "";
  if (this.first_name && this.family_name) {
    fullname = `${this.family_name}, ${this.first_name}`;
  }

  return fullname;
});

// Virtual for author's URL
AuthorSchema.virtual("url").get(function () {
  // We don't use an arrow function as we'll need the this object
  return `/catalog/author/${this._id}`;
});

// Calculate the lifespan in years
AuthorSchema.virtual("lifespan").get(function () {
  if (this.date_of_birth) {
    const birthDate = this.date_of_birth;
    let deathDate = this.date_of_death;

    if (!deathDate) {
      // If there's no death date, use the current date as the death date
      deathDate = new Date();
    }

    const timeDifferenceMs = deathDate - birthDate;
    const millisecondsInYear = 31536000000; // Approximate number of milliseconds in a year

    const years = Math.round(timeDifferenceMs / millisecondsInYear);

    return years;
  }

  return 0; // If birthDate is not available, return 0.
});

// Export model
module.exports = mongoose.model("Author", AuthorSchema);
