import React from 'react';
import '../styles/OfferSection.css';

const offers = [
  { title: 'First Order Discount', discount: '-20%', imageUrl: 'first-order.jpg' },
  { title: 'Vegan Discount', discount: '-20%', imageUrl: 'vegan-discount.jpg' },
  { title: 'Free Ice Cream Offer', discount: '-100%', imageUrl: 'ice-cream.jpg' },
];

const OfferSection = () => {
  return (
    <section className="offer-section">
      {offers.map((offer, index) => (
        <div key={index} className="offer-card">
          <img src={offer.imageUrl} alt={offer.title} />
          <div className="offer-details">
            <h3>{offer.title}</h3>
            <span>{offer.discount}</span>
          </div>
        </div>
      ))}
    </section>
  );
}

export default OfferSection;
