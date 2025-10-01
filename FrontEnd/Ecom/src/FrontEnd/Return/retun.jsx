import { motion } from "framer-motion";
import { RotateCcw, CreditCard, Package, HelpCircle } from "lucide-react";

export default function ReturnRefundPage() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="max-w-5xl mx-auto px-4 py-10"
    >
      {/* Header */}
      <div className="text-center mb-10">
        <motion.div
          whileHover={{ scale: 1.1, rotate: -6 }}
          className="w-20 h-20 mx-auto flex items-center justify-center rounded-full bg-gradient-to-tr from-pink-500 via-red-500 to-yellow-400 text-white shadow-lg"
        >
          <RotateCcw size={34} />
        </motion.div>
        <h1 className="text-3xl md:text-4xl font-extrabold mt-4 text-gray-900">
          Return & Refund Policy
        </h1>
        <p className="text-gray-600 mt-2">
          Hassle-free returns and quick refunds for a smooth shopping experience.
        </p>
      </div>

      {/* Policy Cards */}
      <motion.div
        className="grid md:grid-cols-3 gap-6 mb-12"
        initial="hidden"
        animate="visible"
        variants={{ visible: { transition: { staggerChildren: 0.2 } } }}
      >
        {[
          {
            icon: <Package size={26} />,
            title: "7-Day Return",
            desc: "Return your product within 7 days of delivery if you're not satisfied."
          },
          {
            icon: <CreditCard size={26} />,
            title: "Instant Refund",
            desc: "Get a quick refund once the returned item passes inspection."
          },
          {
            icon: <HelpCircle size={26} />,
            title: "24/7 Support",
            desc: "Our support team is here to help you with any return or refund queries."
          }
        ].map((item, idx) => (
          <motion.div
            key={idx}
            whileHover={{ scale: 1.05 }}
            className="p-6 bg-white rounded-2xl shadow-md border hover:shadow-xl transition"
          >
            <div className="w-12 h-12 flex items-center justify-center rounded-xl bg-red-100 text-red-600 mb-4">
              {item.icon}
            </div>
            <h3 className="font-semibold text-lg mb-2 text-gray-800">{item.title}</h3>
            <p className="text-sm text-gray-600">{item.desc}</p>
          </motion.div>
        ))}
      </motion.div>

      {/* Refund Process Timeline */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          Refund Process
        </h2>
        <ol className="relative border-l border-gray-200">
          {[
            { step: "Request", desc: "Submit your return request via your account." },
            { step: "Pickup", desc: "We’ll arrange pickup or drop-off of the product." },
            { step: "Inspection", desc: "Our team will check the product condition." },
            { step: "Refund", desc: "Refund will be credited within 3–5 business days." }
          ].map((item, idx) => (
            <motion.li
              key={idx}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.2 }}
              className="mb-10 ml-6"
            >
              <span className="absolute -left-3 flex items-center justify-center w-6 h-6 rounded-full bg-red-500 text-white text-xs font-bold">
                {idx + 1}
              </span>
              <h3 className="font-semibold text-gray-800">{item.step}</h3>
              <p className="text-sm text-gray-600">{item.desc}</p>
            </motion.li>
          ))}
        </ol>
      </div>

      {/* FAQ Section */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          Frequently Asked Questions
        </h2>
        <div className="space-y-4">
          {[
            {
              q: "How long does it take to process a refund?",
              a: "Usually within 3–5 business days after product inspection."
            },
            {
              q: "Can I return a used product?",
              a: "Only unused products in original condition with packaging are eligible."
            },
            {
              q: "Who covers the return shipping cost?",
              a: "If the product is faulty/damaged, we cover the cost. Otherwise, the customer does."
            }
          ].map((item, idx) => (
            <motion.div
              key={idx}
              whileHover={{ scale: 1.02 }}
              className="p-5 rounded-xl border bg-white shadow-sm"
            >
              <h3 className="font-medium text-gray-800">{item.q}</h3>
              <p className="text-sm text-gray-600 mt-1">{item.a}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
