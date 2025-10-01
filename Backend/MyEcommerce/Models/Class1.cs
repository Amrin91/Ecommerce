using System;

namespace MyEcommerce.Models
{
    public static class PaymentMethods
    {
        public const string CashOnDelivery = "Cash on Delivery";
        public const string Bkash = "Bkash";
        public const string Nagad = "Nagad";
        public const string Card = "Card";

        public static readonly string[] All = { CashOnDelivery, Bkash, Nagad, Card };
    }
}
