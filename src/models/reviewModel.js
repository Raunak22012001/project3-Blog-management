// Review Model (Books review)
// {
//   bookId: {
//     type:ObjectId, 
//     required:true,
//     ref:"Book"
// },
//   reviewedBy: {
//     type:String, 
//     required:true,
//     default:'Guest', 
//     value: reviewer's name
// },
//   reviewedAt: {Date, mandatory},
//   rating: {number, min 1, max 5, mandatory},
//   review: {string, optional}
//   isDeleted: {boolean, default: false},
// }