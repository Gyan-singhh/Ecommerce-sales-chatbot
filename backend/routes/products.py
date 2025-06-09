from flask import Blueprint, request, jsonify
from models import db, Product
from sqlalchemy import or_

bp = Blueprint("products", __name__)


@bp.route("/products", methods=["GET"])
def get_products():
    q = request.args.get("q", "").strip()
    products = Product.query.filter(
        or_(
            Product.name.ilike(f"%{q}%"),
            Product.category.ilike(f"%{q}%"),
            Product.description.ilike(f"%{q}%")
        )
    ).all()
    return jsonify([
        {
            "id": p.id,
            "name": p.name,
            "category": p.category,
            "price": p.price,
            "description": p.description,
            "image": p.image 
        } for p in products
    ])


@bp.route("/categories", methods=["GET"])
def get_categories():
    categories = db.session.query(Product.category).distinct().all()
    unique = [c[0] for c in categories]
    return jsonify(unique)


@bp.route("/product/<int:id>", methods=["GET"])
def get_product(id):
    product = Product.query.get(id)
    if not product:
        return jsonify({"error": "Product not found"}), 404
    return jsonify({
        "id": product.id,
        "name": product.name,
        "price": product.price,
        "category": product.category
    })
