import React from 'react';
import { X, Package, Clock, CheckCircle, Truck, ChefHat } from 'lucide-react';
import { useOrders } from '../context/OrderContext';

interface OrdersModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const OrdersModal: React.FC<OrdersModalProps> = ({ isOpen, onClose }) => {
  const { orders } = useOrders();

  if (!isOpen) return null;

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="w-5 h-5 text-yellow-500" />;
      case 'confirmed':
        return <CheckCircle className="w-5 h-5 text-blue-500" />;
      case 'preparing':
        return <ChefHat className="w-5 h-5 text-orange-500" />;
      case 'delivering':
        return <Truck className="w-5 h-5 text-purple-500" />;
      case 'delivered':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      default:
        return <Package className="w-5 h-5 text-gray-500" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending':
        return 'Aguardando confirmação';
      case 'confirmed':
        return 'Pedido confirmado';
      case 'preparing':
        return 'Preparando';
      case 'delivering':
        return 'Saiu para entrega';
      case 'delivered':
        return 'Entregue';
      default:
        return status;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'confirmed':
        return 'bg-blue-100 text-blue-800';
      case 'preparing':
        return 'bg-orange-100 text-orange-800';
      case 'delivering':
        return 'bg-purple-100 text-purple-800';
      case 'delivered':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-start pt-8">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[80vh] overflow-hidden">
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900 flex items-center">
              <Package className="w-6 h-6 mr-2 text-purple-600" />
              Meus Pedidos
            </h2>
            <button 
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        <div className="p-6 overflow-y-auto max-h-[60vh]">
          {orders.length === 0 ? (
            <div className="text-center text-gray-500 py-12">
              <Package className="w-16 h-16 mx-auto mb-4 text-gray-300" />
              <p className="text-lg">Nenhum pedido encontrado</p>
              <p className="text-sm mt-2">Faça seu primeiro pedido!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {orders.map((order) => (
                <div key={order.id} className="border border-gray-200 rounded-xl p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <span className="font-bold text-gray-900">#{order.id}</span>
                      <span className={`px-3 py-1 rounded-full text-sm font-medium flex items-center space-x-1 ${getStatusColor(order.status)}`}>
                        {getStatusIcon(order.status)}
                        <span>{getStatusText(order.status)}</span>
                      </span>
                    </div>
                    <span className="text-lg font-bold text-purple-600">R$ {order.total.toFixed(2)}</span>
                  </div>

                  <div className="text-sm text-gray-600 mb-3">
                    <p className="flex items-center">
                      <Clock className="w-4 h-4 mr-1" />
                      Pedido feito em {order.createdAt.toLocaleString('pt-BR')}
                    </p>
                    {order.status === 'delivering' && (
                      <p className="flex items-center mt-1 text-purple-600 font-medium">
                        <Truck className="w-4 h-4 mr-1" />
                        Previsão: {order.estimatedDelivery.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    )}
                  </div>

                  <div className="space-y-1">
                    {order.items.map((item) => (
                      <div key={item.id} className="flex justify-between text-sm">
                        <span className="text-gray-700">{item.quantity}x {item.food.name}</span>
                        <span className="text-gray-900">R$ {(item.food.price * item.quantity).toFixed(2)}</span>
                      </div>
                    ))}
                  </div>

                  <div className="mt-3 pt-3 border-t border-gray-100">
                    <p className="text-sm text-gray-600">
                      <strong>Entrega:</strong> {order.deliveryAddress}
                    </p>
                    <p className="text-sm text-gray-600">
                      <strong>Pagamento:</strong> {
                        order.paymentMethod === 'credit' ? 'Cartão de Crédito' :
                        order.paymentMethod === 'debit' ? 'Cartão de Débito' :
                        order.paymentMethod === 'pix' ? 'PIX' : 'Dinheiro'
                      }
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};