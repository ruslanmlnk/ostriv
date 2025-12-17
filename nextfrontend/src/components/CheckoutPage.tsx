'use client';

import React, { useState, useEffect, useRef } from 'react';
import { House, ChevronRight, Truck, User, Wallet } from 'lucide-react';
import { useCart } from './CartContext';
import { useNavigation } from './NavigationContext';
import { api } from '../api';
import UiImage from './UiImage';

import { novaPoshtaApi } from '../api/np';
import type { NPCity, NPWarehouse } from '../types';

const CheckoutPage: React.FC = () => {
  const { items, totalAmount } = useCart();
  const { navigateTo } = useNavigation();

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    email: '',
    city: '',
    warehouse: '',
    paymentMethod: 'card',
  });

  // NP state
  const [cityQuery, setCityQuery] = useState('');
  const [cities, setCities] = useState<NPCity[]>([]);
  const [selectedCity, setSelectedCity] = useState<NPCity | null>(null);

  const [showCityDropdown, setShowCityDropdown] = useState(false);
  const [warehouses, setWarehouses] = useState<NPWarehouse[]>([]);

  const [isCitiesLoading, setIsCitiesLoading] = useState(false);
  const [isWhLoading, setIsWhLoading] = useState(false);

  const [citiesError, setCitiesError] = useState<string | null>(null);
  const [warehousesError, setWarehousesError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const dropdownRef = useRef<HTMLDivElement>(null);
  const citySearchTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowCityDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;

    // city is handled separately (API + dropdown)
    if (name === 'city') return;

    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    setFormData((prev) => ({ ...prev, city: value, warehouse: '' }));
    setCityQuery(value);
    setSelectedCity(null);
    setWarehouses([]);
    setWarehousesError(null);
    setShowCityDropdown(true);

    if (citySearchTimeout.current) clearTimeout(citySearchTimeout.current);

    citySearchTimeout.current = setTimeout(async () => {
      const q = value.trim();
      if (q.length < 2) {
        setCities([]);
        setCitiesError(null);
        return;
      }

      setIsCitiesLoading(true);
      setCitiesError(null);
      try {
        const found = await novaPoshtaApi.searchSettlements(q);
        setCities(found);
      } catch (error) {
        setCities([]);
        setCitiesError(error instanceof Error ? error.message : 'Не вдалося завантажити міста');
      }
      setIsCitiesLoading(false);
    }, 300);
  };

  const selectCity = async (city: NPCity) => {
    setSelectedCity(city);

    // show pretty text in input
    const display = city.Present || city.MainDescription || '';
    setFormData((prev) => ({ ...prev, city: display, warehouse: '' }));
    setCityQuery(display);

    setShowCityDropdown(false);

    setIsWhLoading(true);
    setWarehousesError(null);
    try {
      const wh = await novaPoshtaApi.getWarehouses(
        city.CityRef || city.Ref || String(city.SettlementId || ''),
        city.MainDescription || display
      );
      setWarehouses(wh);
      if (wh.length === 0) {
        setWarehousesError('Відділення не знайдено');
      }
    } catch (error) {
      setWarehouses([]);
      setWarehousesError(error instanceof Error ? error.message : 'Не вдалося завантажити відділення');
    }
    setIsWhLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (isSubmitting) return;
    setIsSubmitting(true);

    try {
      const orderData = {
        customer: {
          firstName: formData.firstName,
          lastName: formData.lastName,
          phone: formData.phone,
          email: formData.email,
        },
        delivery: {
          city: formData.city, // можна зберігати text
          warehouse: formData.warehouse, // Description
          method: 'nova_poshta',
          // Якщо хочеш — можеш також відправляти cityRef:
          // cityRef: selectedCity?.Ref,
        },
        paymentMethod: formData.paymentMethod,
        items: items.map((item) => ({ product_id: item.id, quantity: item.quantity })),
        total: totalAmount,
      };

      const response = await api.createOrder(orderData);
      if (!response?.success) {
        alert('Не вдалося створити замовлення. Спробуйте ще раз.');
        return;
      }

      if (formData.paymentMethod === 'card') {
        const checkoutRes = await fetch('/api/liqpay/checkout', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            orderId: response.id,
            amount: totalAmount,
          }),
        });

        const checkoutJson = await checkoutRes.json().catch(() => null);
        const endpoint = checkoutJson?.endpoint;
        const data = checkoutJson?.data;
        const signature = checkoutJson?.signature;

        if (
          !checkoutRes.ok ||
          typeof endpoint !== 'string' ||
          !endpoint ||
          typeof data !== 'string' ||
          !data ||
          typeof signature !== 'string' ||
          !signature
        ) {
          const message = checkoutJson?.error || 'Не вдалося ініціалізувати оплату LiqPay.';
          alert(message);
          return;
        }

        const form = document.createElement('form');
        form.method = 'POST';
        form.action = endpoint;
        form.acceptCharset = 'utf-8';

        const dataInput = document.createElement('input');
        dataInput.type = 'hidden';
        dataInput.name = 'data';
        dataInput.value = data;

        const signatureInput = document.createElement('input');
        signatureInput.type = 'hidden';
        signatureInput.name = 'signature';
        signatureInput.value = signature;

        form.appendChild(dataInput);
        form.appendChild(signatureInput);
        document.body.appendChild(form);
        form.submit();
        return;
      }

      alert('Замовлення успішно оформлено!');
      navigateTo('home');
    } catch (error) {
      console.error('Checkout submit error:', error);
      alert(error instanceof Error ? error.message : 'Сталася помилка. Спробуйте ще раз.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="w-full max-w-[1352px] mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl font-bold mb-4">Ваш кошик порожній</h2>
        <button onClick={() => navigateTo('catalog')} className="text-amber-500 underline">
          Перейти до каталогу
        </button>
      </div>
    );
  }

  return (
    <div className="w-full max-w-[1352px] mx-auto px-4 py-6">
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-2 text-xs text-amber-400 mb-8">
        <button onClick={() => navigateTo('home')}>
          <House
            size={16}
            className="fill-gray-400 text-gray-400 hover:text-amber-500 hover:fill-amber-500 transition-colors"
          />
        </button>
        <ChevronRight size={14} className="text-gray-300" />
        <button onClick={() => navigateTo('cart')} className="text-amber-500 font-medium hover:underline">
          Кошик
        </button>
        <ChevronRight size={14} className="text-gray-300" />
        <span className="text-amber-500 font-medium">Оформлення замовлення</span>
      </nav>

      <h1 className="text-3xl font-extrabold uppercase text-gray-900 mb-8">Оформлення замовлення</h1>

      <form onSubmit={handleSubmit} className="w-full">
        {/* SECTION 1: ITEMS TABLE */}
        <div className="w-full mb-10">
          {/* Table Header */}
          <div className="hidden md:grid grid-cols-12 gap-4 bg-[#2a2a2a] text-white p-4 text-sm font-bold uppercase rounded-t-sm">
            <div className="col-span-3">Зображення товару</div>
            <div className="col-span-3">Назва товару</div>
            <div className="col-span-2">Модель</div>
            <div className="col-span-2">Кількість</div>
            <div className="col-span-2">Ціна</div>
          </div>

          {/* Cart Items */}
          <div className="bg-white border border-gray-200 border-t-0">
            {items.map((item) => (
              <div
                key={item.id}
                className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center p-4 border-b border-gray-100 last:border-0 min-h-[100px]"
              >
                {/* Image */}
                <div className="col-span-1 md:col-span-3 flex justify-center md:justify-start">
                  <div className="w-20 h-20 flex items-center justify-center">
                    <UiImage
                      src={item.image}
                      alt={item.name}
                      className="max-h-full max-w-full object-contain"
                      width={120}
                      height={120}
                    />
                  </div>
                </div>

                {/* Name */}
                <div className="col-span-1 md:col-span-3">
                  <span className="md:hidden font-bold mr-2 text-xs uppercase text-gray-500">Назва:</span>
                  <span className="font-bold text-gray-900 text-sm">{item.name}</span>
                </div>

                {/* Model */}
                <div className="col-span-1 md:col-span-2">
                  <span className="md:hidden font-bold mr-2 text-xs uppercase text-gray-500">Модель:</span>
                  <span className="font-bold text-gray-900 text-sm">{item.model}</span>
                </div>

                {/* Quantity */}
                <div className="col-span-1 md:col-span-2 flex items-center">
                  <span className="md:hidden font-bold mr-2 text-xs uppercase text-gray-500">Кількість:</span>
                  <div className="flex items-center bg-[#EDEDED] rounded-sm">
                    <span className="w-10 h-10 flex items-center justify-center text-gray-500">-</span>
                    <span className="w-10 h-10 flex items-center justify-center text-sm font-bold text-gray-900 border-x border-gray-200 bg-white">
                      {item.quantity}
                    </span>
                    <span className="w-10 h-10 flex items-center justify-center text-gray-500">+</span>
                  </div>
                </div>

                {/* Price */}
                <div className="col-span-1 md:col-span-2">
                  <span className="md:hidden font-bold mr-2 text-xs uppercase text-gray-500">Ціна:</span>
                  <span className="font-bold text-gray-900 text-sm whitespace-nowrap">
                    ₴{item.price.toLocaleString('uk-UA')}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Total Bar */}
          <div className="bg-amber-400 text-white font-bold uppercase p-4 pr-8 flex justify-end items-center gap-12 rounded-b-sm">
            <span className="text-sm">Усього</span>
            <span className="text-xl text-gray-900">₴{totalAmount.toLocaleString('uk-UA')}</span>
          </div>
        </div>

        {/* SECTION 2: FORMS */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* LEFT COLUMN: PERSONAL DATA */}
          <div className="bg-gray-100/50 rounded-sm">
            <div className="bg-[#EDEDED] p-4 flex items-center gap-3 rounded-t-sm">
              <div className="w-8 h-8 rounded-sm bg-amber-400 flex items-center justify-center text-white">
                <User size={18} />
              </div>
              <h3 className="text-sm font-bold uppercase text-gray-900">Ваші особисті дані</h3>
            </div>

            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-[#EDEDED] rounded-sm px-4 py-3">
                <input
                  type="text"
                  name="firstName"
                  required
                  value={formData.firstName}
                  onChange={handleInputChange}
                  className="w-full bg-transparent border-none text-sm focus:outline-none placeholder-gray-500 text-gray-900"
                  placeholder="Ім'я*"
                />
              </div>

              <div className="bg-[#EDEDED] rounded-sm px-4 py-3">
                <input
                  type="text"
                  name="lastName"
                  required
                  value={formData.lastName}
                  onChange={handleInputChange}
                  className="w-full bg-transparent border-none text-sm focus:outline-none placeholder-gray-500 text-gray-900"
                  placeholder="Прізвище*"
                />
              </div>

              <div className="bg-[#EDEDED] rounded-sm px-4 py-3">
                <input
                  type="tel"
                  name="phone"
                  required
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="w-full bg-transparent border-none text-sm focus:outline-none placeholder-gray-500 text-gray-900"
                  placeholder="Телефон*"
                />
              </div>

              <div className="bg-[#EDEDED] rounded-sm px-4 py-3">
                <input
                  type="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full bg-transparent border-none text-sm focus:outline-none placeholder-gray-500 text-gray-900"
                  placeholder="Адреса електронної пошти*"
                />
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: DELIVERY & PAYMENT */}
          <div className="flex flex-col gap-8">
            {/* Delivery */}
            <div className="bg-gray-100/50 rounded-sm">
              <div className="bg-[#EDEDED] p-4 flex items-center gap-3 rounded-t-sm">
                <div className="w-8 h-8 rounded-sm bg-amber-400 flex items-center justify-center text-white">
                  <Truck size={18} />
                </div>
                <h3 className="text-sm font-bold uppercase text-gray-900">Доставка</h3>
              </div>

              <div className="p-6 space-y-4">
                {/* City input + dropdown */}
                <div className="bg-[#EDEDED] rounded-sm px-2 py-1 relative" ref={dropdownRef}>
                  <input
                    type="text"
                    name="city"
                    required
                    value={formData.city}
                    onChange={handleCityChange}
                    onFocus={() => setShowCityDropdown(true)}
                    className="w-full bg-transparent border-none text-sm p-2 focus:outline-none placeholder-gray-500 text-gray-900"
                    placeholder="Вкажіть ваше місто"
                    autoComplete="off"
                  />

                  {/* Triangle indicator */}
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                    <div className="w-0 h-0 border-l-[4px] border-l-transparent border-r-[4px] border-r-transparent border-t-[6px] border-t-amber-500"></div>
                  </div>

                  {showCityDropdown && (
                    <ul className="absolute z-20 left-0 top-full w-full bg-white border border-gray-200 max-h-60 overflow-y-auto shadow-lg mt-1">
                      {isCitiesLoading ? (
                        <li className="px-4 py-2 text-sm text-gray-400">Завантаження...</li>
                      ) : citiesError ? (
                        <li className="px-4 py-2 text-sm text-red-600">{citiesError}</li>
                      ) : cities.length > 0 ? (
                        cities.map((city) => (
                          <li
                            key={city.Ref}
                            onClick={() => selectCity(city)}
                            className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm text-gray-900"
                          >
                            {city.Present}
                          </li>
                        ))
                      ) : (
                        <li className="px-4 py-2 text-sm text-gray-400">
                          {cityQuery.trim().length < 2 ? 'Введіть мінімум 2 символи' : 'Нічого не знайдено'}
                        </li>
                      )}
                    </ul>
                  )}
                </div>

                {/* Nova Poshta Radio */}
                <div className="flex items-center gap-3 my-4">
                  <input type="radio" checked={true} readOnly className="text-amber-400 focus:ring-amber-400 w-4 h-4" />
                  <div className="w-6 h-6 bg-red-600 text-white flex items-center justify-center font-bold text-xs rounded-sm">
                    НП
                  </div>
                  <span className="font-bold text-gray-900 text-sm">Нова пошта</span>
                </div>

                {/* Warehouse Select */}
                <div className="bg-[#EDEDED] rounded-sm px-2 py-1 relative">
                  <select
                    name="warehouse"
                    value={formData.warehouse}
                    onChange={handleInputChange}
                    className="w-full bg-transparent border-none text-sm p-2 focus:outline-none text-gray-900 appearance-none"
                    disabled={!selectedCity || isWhLoading}
                    required
                  >
                    <option value="" className="text-gray-500">
                      {isWhLoading ? 'Завантаження відділень...' : warehousesError || 'Виберіть відділення'}
                    </option>

                    {warehouses.map((wh) => (
                      <option key={wh.Ref} value={wh.Description}>
                        {wh.Description}
                      </option>
                    ))}
                  </select>

                  {/* Triangle indicator */}
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                    <div className="w-0 h-0 border-l-[4px] border-l-transparent border-r-[4px] border-r-transparent border-t-[6px] border-t-amber-500"></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Payment */}
            <div className="bg-gray-100/50 rounded-sm">
              <div className="bg-[#EDEDED] p-4 flex items-center gap-3 rounded-t-sm">
                <div className="w-8 h-8 rounded-sm bg-amber-400 flex items-center justify-center text-white">
                  <Wallet size={18} />
                </div>
                <h3 className="text-sm font-bold uppercase text-gray-900">Метод оплати</h3>
              </div>

              <div className="p-6 space-y-3">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="cod"
                    checked={formData.paymentMethod === 'cod'}
                    onChange={handleInputChange}
                    className="text-amber-400 focus:ring-amber-400 w-4 h-4"
                  />
                  <span className="text-sm text-gray-900">Оплата під час доставки (накладений платіж)</span>
                </label>

                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="card"
                    checked={formData.paymentMethod === 'card'}
                    onChange={handleInputChange}
                    className="text-amber-400 focus:ring-amber-400 w-4 h-4"
                  />
                  <span className="text-sm text-gray-900">Онлайн-оплата карткою (LiqPay)</span>
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* SECTION 3: BUTTONS */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 mt-8">
          <button
            type="button"
            onClick={() => navigateTo('cart')}
            className="bg-[#8C8C8C] hover:bg-[#777] text-white font-bold uppercase text-xs px-8 py-4 rounded-sm transition-colors w-full md:w-auto"
          >
            ПРОДОВЖИТИ ПОКУПКИ
          </button>

          <button
            type="submit"
            disabled={isSubmitting}
            className="bg-amber-400 hover:bg-amber-500 text-white font-bold uppercase text-xs px-8 py-4 rounded-sm shadow-md hover:shadow-lg transition-colors w-full md:w-auto disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Обробка…' : 'ОФОРМИТИ ЗАМОВЛЕННЯ'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CheckoutPage;
