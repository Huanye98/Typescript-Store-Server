# Canvas&Chaos

## [See the App!] https://canvasandchaos.netlify.app/

## Description

The page is part of a full-stack web application built with a TypeScript React front-end, an Express back-end, and a PostgreSQL database. The interface uses Material-UI (MUI) for a polished, responsive, and modern design.

#### [Repository Link Client] https://github.com/Huanye98/Typescript-Store-Client

#### [Repository Link Server] https://github.com/Huanye98/Typescript-Store-Server

## Backlog Functionalities

- [ ] Email users with Nodemailer.
- [ ] Implement the Printful API for shipping.

## Technologies used

NodeJS, Javascript, Express, JsonWebtoken, bcrypt, PostgreSQL, SQL,PG.

# Server Structure

## PostgreDatabase tables



### Table: `cart`

- **Purpose**: Stores the shopping cart details for users.

| Column Name | Data Type        | Constraints                     | Description                       |
|-------------|------------------|---------------------------------|-----------------------------------|
| `id`        | `integer`        | `PRIMARY KEY`, `NOT NULL`       | Unique identifier for the cart.  |
| `user_id`   | `integer`        | `FOREIGN KEY`                  | References `users.id`.           |
| `status`    | `text`           | `DEFAULT 'active'`             | Status of the cart.              |
| `total`     | `numeric(10,2)`  | `DEFAULT 0`                    | Total cost of items in the cart. |

**Relationships**:  
- `user_id` → `users.id`

---

### Table: `cart_items`

- **Purpose**: Tracks individual items in user carts.

| Column Name   | Data Type        | Constraints                    | Description                                   |
|---------------|------------------|--------------------------------|-----------------------------------------------|
| `id`          | `integer`        | `PRIMARY KEY`, `NOT NULL`      | Unique identifier for each cart item.        |
| `user_id`     | `integer`        | `NOT NULL`, `FOREIGN KEY`      | References `users.id`.                       |
| `created_at`  | `timestamp`      | `DEFAULT CURRENT_TIMESTAMP`    | Timestamp of item creation.                  |
| `updated_at`  | `timestamp`      | `DEFAULT CURRENT_TIMESTAMP`    | Timestamp of the last update.                |
| `product_id`  | `integer`        | `FOREIGN KEY`                 | References `products.id`.                    |
| `quantity`    | `integer`        | `DEFAULT 0`                    | Quantity of the product in the cart.         |
| `cart_id`     | `integer`        | `FOREIGN KEY`                 | References `cart.id`.                        |

**Relationships**:  
- `cart_id` → `cart.id`  
- `product_id` → `products.id`  
- `user_id` → `users.id`

---

### Table: `collections`

- **Purpose**: Groups products into categories or themes.

| Column Name   | Data Type          | Constraints                  | Description                       |
|---------------|--------------------|-----------------------------|-----------------------------------|
| `id`          | `integer`          | `PRIMARY KEY`, `NOT NULL`   | Unique identifier for collections.|
| `name`        | `varchar(255)`     | `NOT NULL`                  | Name of the collection.           |
| `is_featured` | `boolean`          | `DEFAULT false`             | Indicates if the collection is featured. |
| `created_at`  | `timestamp`        | `DEFAULT CURRENT_TIMESTAMP` | Timestamp of collection creation. |

---

### Table: `products`

- **Purpose**: Stores details about available products.

| Column Name       | Data Type       | Constraints                          | Description                                  |
|-------------------|-----------------|--------------------------------------|----------------------------------------------|
| `id`              | `integer`      | `PRIMARY KEY`, `NOT NULL`           | Unique identifier for the product.          |
| `name`            | `text`         | `NOT NULL`                          | Name of the product.                        |
| `price`           | `numeric(10,2)`| `NOT NULL`, `CHECK price >= 0`      | Price of the product.                       |
| `description`     | `text`         |                                      | Product description.                        |
| `isavaliable`     | `boolean`      | `DEFAULT false`                     | Indicates if the product is available.      |
| `discountvalue`   | `numeric(10,2)`| `DEFAULT 1`, `CHECK discountvalue >= 0` | Discount applied to the product.           |
| `imageurl`        | `text`         |                                      | URL of the product image.                   |
| `category`        | `text`         | `CHECK category IN ('Print', 'Home goods', 'Apparel', 'Digital goods')` | Category of the product. |
| `collection_id`   | `integer`      | `FOREIGN KEY`                       | References `collections.id`.                |
| `is_featured`     | `boolean`      | `DEFAULT false`                     | Indicates if the product is featured.       |
| `stock`           | `numeric(5,0)` | `DEFAULT 0`                         | Number of products in stock.                |
| `created_at`      | `timestamp`    | `DEFAULT CURRENT_TIMESTAMP`         | Timestamp of product creation.              |
| `items_sold`      | `integer`      | `DEFAULT 0`, `CHECK items_sold >= 0`| Number of items sold.                       |

**Relationships**:  
- `collection_id` → `collections.id`

---

### Table: `transactions`

- **Purpose**: Tracks payment details for orders.

| Column Name      | Data Type       | Constraints                          | Description                          |
|------------------|-----------------|--------------------------------------|--------------------------------------|
| `id`             | `integer`      | `PRIMARY KEY`, `NOT NULL`           | Unique identifier for the transaction. |
| `payment_id`     | `varchar(255)` | `NOT NULL`                          | Payment processor ID.                |
| `user_id`        | `integer`      | `NOT NULL`, `FOREIGN KEY`           | References `users.id`.               |
| `amount`         | `numeric(10,2)`| `NOT NULL`                          | Total amount for the transaction.    |
| `currency`       | `varchar(10)`  | `NOT NULL`                          | Currency type (e.g., USD).           |
| `status`         | `varchar(50)`  | `NOT NULL`                          | Status of the transaction (e.g., success).|
| `client_secret`  | `varchar(255)` |                                      | Client secret for payment.           |
| `created_at`     | `timestamp`    | `DEFAULT now()`                     | Timestamp of transaction creation.   |
| `updated_at`     | `timestamp`    | `DEFAULT now()`                     | Timestamp of last update.            |

---

### Table: `users`

- **Purpose**: Stores user details and roles.

| Column Name  | Data Type       | Constraints                      | Description                                  |
|--------------|-----------------|----------------------------------|---------------------------------------------|
| `id`         | `integer`       | `PRIMARY KEY`, `NOT NULL`       | Unique identifier for each user.            |
| `email`      | `varchar(255)`  | `NOT NULL`, `UNIQUE`            | User's email address.                       |
| `password`   | `text`          | `NOT NULL`                      | User's hashed password.                     |
| `role`       | `user_role`     | `DEFAULT 'user'`                | User role (e.g., admin, user).              |
| `name`       | `varchar(15)`   | `DEFAULT 'undefined'`           | User's name.                                |
| `address`    | `text`          |                                  | User's physical address.                    |
| `cart_id`    | `integer`       | `FOREIGN KEY`                   | References `cart.id`.                       |
| `created_at` | `timestamp`     | `DEFAULT CURRENT_TIMESTAMP`     | Timestamp of account creation.              |
| `updated_at` | `timestamp`     | `DEFAULT CURRENT_TIMESTAMP`     | Timestamp of the last update.               |

---


## API Endpoints

| HTTP Method | URL                              | Request Body                                                                                             | Success Status | Error Status | Description                                             |
| ----------- | -------------------------------- | -------------------------------------------------------------------------------------------------------- | -------------- | ------------ | ------------------------------------------------------- |
| POST        | `/users/create`                  | `{email, password}`                                                                                      | 201            | 400          | Registers the user in the database.                     |
| POST        | `/users/login`                   | `{email, password, role}`                                                                                | 200            | 400          | Validates credentials, creates, and sends a token.      |
| GET         | `/auth/verify`                   | `req.headers.authorization`                                                                              | 200            | 403          | Verifies the user's token.                              |
| GET         | `/products/all`                  | `N/A`                                                                                                    | 200            | 404          | Retrieves all products.                                 |
| GET         | `/products`                      | `{id, category, collection, sort, isavaliable, is_featured, page, limit, search,}`                       | 200            | 404          | Retrieves all products.                                 |
| POST        | `/products/create`               | `{name, price, description,isavaliable,discountvalue,imageurl,category,collection_id,is_featured,stock}` | 201            | 400          | Adds a new product to the database (Admin only).        |
| PATCH       | `/products/:productId`           | `{name, price, description,isavaliable,discountvalue,imageurl,category,collection_id,is_featured,stock}` | 200            | 400/404      | Updates the specified product (Admin only).             |
| DELETE      | `/products/:productId`           | `N/A`                                                                                                    | 200            | 404          | Deletes the specified product (Admin only).             |
| POST        | `/payment/create-payment-intent` | `{paymentId, userId, amount, currency,status,clientSecret}`                                              | 201            | 400/500      | Initiates payment with Stripe.                          |
| PATCH       | `/payment/update-payment-intent` | `{paymentIntentId, clientSecret}`                                                                        | 200            | 400/500      | Updates Stripe payment details.                         |
| POST        | `/upload`                        | `{Image file}`                                                                                           | 201            | 400          | Uploads images via Cloudinary (Admin only).             |
| GET         | `/users/all`                     | `N/A`                                                                                                    | 200            | 403          | Retrieves all user data (Admin only).                   |
| GET         | `/users/:id`                     | `N/A`                                                                                                    | 200            | 404          | Retrieves the user's profile information.               |
| PATCH       | `/users/modify/:id`              | `{email, address, password, user_id}`                                                                    | 200            | 400          | Updates the user's profile.                             |
| DELETE      | `/users/:id`                     | ` {req.user.id, req.user.role}`                                                                            | 200            | 403/404      | Deletes the user's account after verification.          |
| POST        | `/cart`                          | `{product_id,quantity,user_id,cart_id}`                                                                  | 200            | 400          | Adds a product to the user's cart.                      |
| DELETE      | `/cart/:cart_id`                 | `{product_id, quantity, user_id }`                                                                       | 200            | 404          | Removes an item from the user's cart.                   |
| DELETE      | `/users/cart/:cart_id`           | `{cart_id}`                                                                                              | 200            | 404          | Empties the user's cart after a successful transaction. |

## Links

### Collaborators

[Huanye zhu]
https://github.com/Huanye98?tab=repositories

### Project

[Repository Link Client] https://github.com/Huanye98/Typescript-Store-Client

[Repository Link Server] https://github.com/Huanye98/Typescript-Store-Server

[Deploy Link] https://canvasandchaos.netlify.app/
