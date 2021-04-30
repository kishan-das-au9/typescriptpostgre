# typescriptpostgre

#### Used typecscript, nodejs (expressjs), postgresql to build a virtual library management system
#### Have implemented the login api such that the user can use google login
Once logged in the user auth token with the userid will be stored in our database as well as sessions
Using redis store to store session values. We are storing userid, email and isadmin in session

#### Now there are two routes one for book and the rest are protected routes
1. The book route is consists of the boook list api. The book list api can be accessed without login. Also added limit to the number of books shown at a time using pagelimit and offset. Which will be use to implement pagination at frontend and will improve performace.

2. Rest all apis needs user auth token

#### Now regarding the books, sections, categories, authors and publishers
1. All the search api can be access by any user
2. The add, updpate and delete api can be used only by admins

#### Book Upload
1. Since this is a virtual library the user can also view the book. So added api for uploading files to S3 in AWS.
2. Action can only be performed by admin
3. While deletion along with deleting records from our database we will delete it from S3 as well, have written function for the same

#### Collection
1. Each user can have there own collections of books