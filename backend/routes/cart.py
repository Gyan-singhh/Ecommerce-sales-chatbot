from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from models import db, CartItem, User, Product

cart_bp = Blueprint("cart", __name__)


@cart_bp.route("/cart/items", methods=["GET"])
@jwt_required()
def get_cart_items():
    try:
        user_email = get_jwt_identity()
        if not user_email:
            return jsonify({"error": "Authentication required"}), 401

        user = User.query.filter_by(email=user_email).first()
        if not user:
            return jsonify({"error": "User not found"}), 404

        cart_items = (
            CartItem.query
            .filter_by(user_id=user.id)
            .order_by(CartItem.created_at.desc())
            .all()
        )

        items_list = []
        for item in cart_items:
            product = Product.query.get(item.product_id)
            if product:
                items_list.append({
                    "id": item.id,
                    "product_id": product.id,
                    "name": product.name,
                    "price": float(product.price),
                    "quantity": item.quantity,
                    "image": product.image,
                    "description": product.description
                })

        return jsonify({"items": items_list}), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500


@cart_bp.route("/cart/add", methods=["POST"])
@jwt_required()
def add_to_cart():
    data = request.json
    product_id = data.get("product_id")
    quantity = 1

    if not product_id:
        return jsonify({"error": "Product ID is required"}), 400

    user_email = get_jwt_identity()
    if not user_email:
        return jsonify({"error": "Authentication required"}), 401

    user = User.query.filter_by(email=user_email).first()
    if not user:
        return jsonify({"error": "User not found"}), 404

    item = CartItem.query.filter_by(user_id=user.id, product_id=product_id).first()
    if item:
        item.quantity += quantity
    else:
        item = CartItem(user_id=user.id, product_id=product_id, quantity=quantity)
        db.session.add(item)

    db.session.commit()
    return jsonify({"message": "Product added to cart successfully"})


@cart_bp.route("/cart/remove/<int:product_id>", methods=["DELETE"])
@jwt_required()
def remove_from_cart(product_id):
    try:
        user_email = get_jwt_identity()
        user = User.query.filter_by(email=user_email).first()

        if not user:
            return jsonify({"error": "User not found"}), 404

        cart_item = CartItem.query.filter_by(user_id=user.id, product_id=product_id).first()

        if not cart_item:
            return jsonify({"error": "Item not found in cart"}), 404

        db.session.delete(cart_item)
        db.session.commit()

        return jsonify({"message": "Item removed from cart"}), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500


@cart_bp.route("/cart/<int:product_id>/quantity", methods=["PUT"])
@jwt_required()
def update_cart_item_quantity(product_id):
    try:
        user_email = get_jwt_identity()
        user = User.query.filter_by(email=user_email).first()

        if not user:
            return jsonify({"error": "User not found"}), 404

        data = request.get_json()
        new_quantity = data.get("quantity")

        if not new_quantity or new_quantity < 1:
            return jsonify({"error": "Invalid quantity"}), 400

        cart_item = CartItem.query.filter_by(
            user_id=user.id,
            product_id=product_id
        ).first()

        if not cart_item:
            return jsonify({"error": "Item not found in cart"}), 404

        cart_item.quantity = new_quantity
        db.session.commit()

        return jsonify({
            "message": "Quantity updated",
            "new_quantity": new_quantity
        }), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500
