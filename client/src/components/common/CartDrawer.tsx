import React, { useEffect } from 'react';
import type { Product } from '../../types';
import { X, Trash2, ArrowRight, Sparkles } from 'lucide-react';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: { product: Product; quantity: number }[];
  onRemoveItem: (id: string) => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  items,
  onRemoveItem,
}) => {
  // Lock body scroll on open
  useEffect(() => {
    if (isOpen) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';

      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') onClose();
      };
      window.addEventListener('keydown', handleKeyDown);

      return () => {
        document.body.style.overflow = originalOverflow;
        window.removeEventListener('keydown', handleKeyDown);
      };
    }
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const total = items.reduce(
    (acc, item) => acc + item.product.price * item.quantity,
    0
  );
  const freeShippingThreshold = 80;
  const progressToFreeShipping = Math.min(
    100,
    (total / freeShippingThreshold) * 100
  );

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-brown-900/50 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-0 sm:pl-10">
        <div className="w-screen max-w-full sm:max-w-md bg-cream-100 sm:border-l border-brown-200 shadow-warm-lg flex flex-col justify-between h-full">
          {/* Header */}
          <div className="p-5 sm:p-6 border-b border-brown-200/80 safe-top">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <h3 className="font-serif text-xl text-brown-800 font-medium">
                  Your Bag
                </h3>
                <span className="text-xs text-brown-500 font-light">
                  ({items.reduce((acc, i) => acc + i.quantity, 0)} items)
                </span>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="w-10 h-10 flex items-center justify-center text-brown-500 hover:text-brown-800 rounded-full hover:bg-cream-200 transition-colors"
                aria-label="Close bag"
              >
                <X size={20} />
              </button>
            </div>

            {/* Free Shipping Meter */}
            <div className="mt-4 p-3 rounded-xl bg-cream-200/60 border border-brown-200 text-xs text-brown-700">
              <div className="flex justify-between font-medium mb-1.5">
                <span>
                  {total >= freeShippingThreshold ? (
                    <span className="text-sage-600 font-semibold flex items-center gap-1">
                      <Sparkles size={12} /> You qualify for complimentary shipping!
                    </span>
                  ) : (
                    <span>
                      Add ${(freeShippingThreshold - total).toFixed(0)} more for free delivery
                    </span>
                  )}
                </span>
                <span>{progressToFreeShipping.toFixed(0)}%</span>
              </div>
              <div className="w-full h-1.5 bg-cream-300 rounded-full overflow-hidden">
                <div
                  className="h-full bg-burgundy-500 transition-all duration-300"
                  style={{ width: `${progressToFreeShipping}%` }}
                />
              </div>
            </div>
          </div>

          {/* Items List */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {items.length === 0 ? (
              <div className="text-center py-16 text-brown-400">
                <p className="font-serif italic text-lg text-brown-500 mb-2">
                  Your bag is empty
                </p>
                <p className="text-xs">
                  Discover our handmade pieces and start your collection.
                </p>
              </div>
            ) : (
              items.map(({ product, quantity }) => (
                <div
                  key={product.id}
                  className="flex gap-4 p-3 rounded-xl bg-cream-200/50 border border-brown-200/60"
                >
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-18 h-20 w-16 object-cover rounded-lg border border-brown-200"
                  />
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start">
                        <h4 className="font-serif text-sm font-medium text-brown-800">
                          {product.name}
                        </h4>
                        <button
                          type="button"
                          onClick={() => onRemoveItem(product.id)}
                          className="text-brown-400 hover:text-burgundy-500"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                      <span className="text-[11px] text-brown-400">
                        {product.colorName} • Qty: {quantity}
                      </span>
                    </div>
                    <div className="text-xs font-semibold text-brown-800">
                      ${product.price * quantity}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          <div className="p-5 sm:p-6 border-t border-brown-200/80 bg-cream-100 safe-bottom">
            <div className="flex justify-between text-sm text-brown-800 font-medium mb-3 sm:mb-4">
              <span>Subtotal</span>
              <span className="font-serif text-lg font-semibold">${total}</span>
            </div>
            <p className="text-[11px] text-brown-400 font-light mb-4 text-center">
              Taxes and shipping calculated at checkout. Packaged in recycled paper tied with yarn.
            </p>
            <button
              type="button"
              disabled={items.length === 0}
              className="w-full py-3.5 rounded-full bg-burgundy-500 hover:bg-burgundy-600 disabled:opacity-50 text-cream-100 text-xs uppercase tracking-wider font-semibold shadow-warm transition-all flex items-center justify-center gap-2 min-h-[46px] active:scale-[0.98]"
            >
              <span>Proceed to Checkout</span>
              <ArrowRight size={14} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
