'use client';

import React, { useState, useEffect, useRef } from 'react';
import { House, ChevronRight, Truck, User, Wallet } from 'lucide-react';
import { useCart } from './CartContext';
import { useNavigation } from './NavigationContext';
import { api } from '../api';

const UKRAINIAN_CITIES = [
  "Авдіївка", "Олександрія", "Олександрівськ", "Алмазна", "Алупка", "Алушта", "Алчевськ", "Ананьїв", "Андрушівка", "Антрацит", "Апостолове", "Армянськ", "Арциз",
  "Балаклія", "Балта", "Бар", "Баранівка", "Барвінкове", "Бахмач", "Бахмут", "Баштанка", "Бердичів", "Бердянськ", "Берегове", "Березань", "Березівка", "Березне", "Берестечко", "Берислав", "Бершадь", "Бібрка", "Біла Церква", "Білгород-Дністровський", "Білецьке", "Білопілля", "Біляївка", "Бобринець", "Бобровиця", "Богодухів", "Богуслав", "Болград", "Болехів", "Борзна", "Борислав", "Бориспіль", "Борщів", "Боярка", "Бровари", "Броди", "Брянка", "Буринь", "Бурштин", "Буськ", "Буча", "Бучач",
  "Валки", "Вараш", "Василівка", "Васильків", "Вашківці", "Великі Мости", "Верхньодніпровськ", "Вільнянськ", "Вінниця", "Вижниця", "Вилкове", "Винники", "Виноградів", "Вишгород", "Вишневе", "Вовчанськ", "Вознесенськ", "Волноваха", "Володимир-Волинський", "Волочиськ", "Вугледар",
  "Гадяч", "Гайворон", "Гайсин", "Галич", "Генічеськ", "Герца", "Глобине", "Глухів", "Глиняни", "Гнівань", "Гола Пристань", "Голубівка", "Горішні Плавні", "Горлівка", "Городенка", "Городище", "Городня", "Городок", "Горохів", "Гребінка", "Гуляйполе",
  "Дебальцеве", "Деражня", "Дергачі", "Дніпро", "Дніпрорудне", "Добромиль", "Добропілля", "Докучаєвськ", "Долина", "Долинська", "Донецьк", "Дрогобич", "Дружківка", "Дубляни", "Дубно", "Дубровиця", "Дунаївці",
  "Енергодар",
  "Євпаторія", "Єнакієве",
  "Жашків", "Жданівка", "Жидачів", "Житомир", "Жмеринка", "Жовква", "Жовті Води",
  "Заліщики", "Запоріжжя", "Заставна", "Збараж", "Зборів", "Звенигородка", "Здолбунів", "Зеленодольськ", "Зіньків", "Зміїв", "Знам'янка", "Золоте", "Золотоноша", "Золочів", "Зоринськ", "Зугрес",
  "Івано-Франківськ", "Ізмаїл", "Ізюм", "Ізяслав", "Іллінці", "Іловайськ", "Інкерман", "Ірміно", "Ірпінь", "Іршава", "Ічня",
  "Кагарлик", "Калинівка", "Калуш", "Кам'янець-Подільський", "Кам'янка", "Кам'янка-Бузька", "Кам'янка-Дніпровська", "Кам'янське", "Канів", "Карлівка", "Каховка", "Керч", "Ківерці", "Київ", "Кілія", "Кіцмань", "Кобеляки", "Ковель", "Кодима", "Коломия", "Комишуваха", "Конотоп", "Костянтинівка", "Корець", "Коростень", "Коростишів", "Корсунь-Шевченківський", "Корюківка", "Косів", "Костопіль", "Краматорськ", "Красилів", "Красноград", "Кременець", "Кременчук", "Кремінна", "Кривий Ріг", "Кролевець", "Кропивницький", "Куп'янськ",
  "Ладижин", "Ланівці", "Лебедин", "Лиман", "Лисичанськ", "Лозова", "Лохвиця", "Лубни", "Луганськ", "Лутугине", "Луцьк", "Львів", "Любомль", "Люботин",
  "Макіївка", "Мала Виска", "Малин", "Марганець", "Маріуполь", "Мелітополь", "Мена", "Мерефа", "Миколаїв", "Миргород", "Мирноград", "Миронівка", "Міусинськ", "Могилів-Подільський", "Молодогвардійськ", "Молочанськ", "Монастириська", "Монастирище", "Мостиська", "Мукачево",
  "Надвірна", "Немирів", "Нетішин", "Миколаїв", "Нікополь", "Ніжин", "Нова Каховка", "Нова Одеса", "Новгород-Сіверський", "Новий Буг", "Новий Калинів", "Новий Розділ", "Новоазовськ", "Нововолинськ", "Новоград-Волинський", "Новогродівка", "Новодністровськ", "Новодружеськ", "Новомиргород", "Новомосковськ", "Новоселиця", "Новоукраїнка", "Новояворівськ", "Носівка",
  "Обухів", "Овруч", "Одеса", "Остер", "Острог", "Охтирка", "Очаків",
  "Павлоград", "Первомайськ", "Первомайський", "Перевальськ", "Перемишляни", "Перечин", "Переяслав", "Першотравенськ", "Петрово-Красносілля", "Пирятин", "Погребище", "Підгайці", "Підгородне", "Подільськ", "Покров", "Покровськ", "Пологи", "Полонне", "Полтава", "Попасна", "Почаїв", "Привілля", "Прилуки", "Приморськ", "Прип'ять", "Пустомити", "Путивль",
  "Рава-Руська", "Радехів", "Радомишль", "Рахів", "Ржищів", "Рогатин", "Ровеньки", "Рівне", "Рожище", "Ромни", "Рубіжне", "Рудки",
  "Саки", "Самбір", "Сарни", "Свалява", "Сватове", "Свердловськ", "Світловодськ", "Севастополь", "Селидове", "Семенівка", "Середина-Буда", "Сєвєродонецьк", "Синельникове", "Скадовськ", "Скалат", "Сквира", "Сколе", "Славута", "Славутич", "Слов'янськ", "Сміла", "Снігурівка", "Сніжне", "Снятин", "Сокаль", "Сокиряни", "Соледар", "Старобільськ", "Старокостянтинів", "Старий Самбір", "Стаханов", "Сторожинець", "Стрий", "Судак", "Судова Вишня", "Суми", "Суходільськ",
  "Таврійськ", "Тальне", "Тараща", "Татарбунари", "Теплодар", "Тернопіль", "Тернівка", "Тетіїв", "Тисмениця", "Тлумач", "Токмак", "Торецьк", "Тростянець", "Трускавець", "Тульчин", "Турка",
  "Угнів", "Узин", "Українка", "Ужгород", "Умань", "Устилуг",
  "Фастів", "Феодосія",
  "Харків", "Харцизьк", "Херсон", "Хирів", "Хмельницький", "Хмільник", "Ходорів", "Хорол", "Хотин", "Хрестівка", "Христинівка", "Хрустальний", "Хуст",
  "Часів Яр", "Червоноград", "Черкаси", "Чернівці", "Чернігів", "Чигирин", "Чоп", "Чорноморськ", "Чортків", "Чугуїв",
  "Шаргород", "Шахтарськ", "Шепетівка", "Шостка", "Шпола", "Шумськ",
  "Щастя",
  "Южне", "Южноукраїнськ",
  "Яворів", "Яготин", "Ялта", "Ямпіль", "Яремче", "Ясинувата"
];

// Real data map for major cities to improve demo realism
const REAL_BIG_CITIES_WAREHOUSES: Record<string, string[]> = {
  "Київ": [
    "Відділення №1: вул. Пирогівський шлях, 135",
    "Відділення №2: вул. Богатирська, 11",
    "Відділення №3: вул. Калачівська, 13 (Стара Дарниця)",
    "Відділення №4: вул. Верховинна, 69",
    "Відділення №5: вул. Федорова, 32 (метро Олімпійська)",
    "Відділення №6: вул. Миколи Василенка, 2 (метро Берестейська)",
    "Відділення №7: вул. Гната Юри, 7",
    "Відділення №8: просп. Повітрофлотський, 31",
    "Відділення №9: вул. Сурікова, 3а",
    "Відділення №10: просп. Василя Порика, 13в",
    "Поштомат №1001: вул. Хрещатик, 22 (Головпоштамт)",
    "Поштомат №1002: Майдан Незалежності, 1"
  ],
  "Львів": [
    "Відділення №1: вул. Городоцька, 355/6",
    "Відділення №2: вул. Пластова, 7",
    "Відділення №3: вул. Угорська, 22",
    "Відділення №4: вул. Кульпарківська, 93а",
    "Відділення №5: вул. Данила Апостола, 16х",
    "Відділення №6: вул. Сихівська, 8",
    "Відділення №7: вул. Личаківська, 8",
    "Поштомат №5001: просп. Свободи, 10",
    "Поштомат №5002: пл. Ринок, 1"
  ],
  "Одеса": [
    "Відділення №1: Київське шосе, 27",
    "Відділення №2: вул. Базова, 16 (Промринок, 7 км)",
    "Відділення №3: вул. Дальницька, 23/4",
    "Відділення №4: вул. Академіка Вільямса, 86",
    "Відділення №5: вул. Академіка Філатова, 24",
    "Відділення №6: вул. Миколаївська дорога, 170а",
    "Поштомат №6001: вул. Дерибасівська, 15",
  ],
  "Дніпро": [
    "Відділення №1: вул. Маршала Малиновського, 114",
    "Відділення №2: вул. Академіка Янгеля, 40",
    "Відділення №3: вул. Тверська, 1",
    "Відділення №4: вул. Князя Ярослава Мудрого, 68",
    "Відділення №5: вул. Поля, 2",
    "Поштомат №3001: просп. Дмитра Яворницького, 50"
  ],
  "Харків": [
    "Відділення №1: вул. Польова, 67",
    "Відділення №2: вул. Академіка Павлова, 120",
    "Відділення №3: вул. Тюрінська, 124",
    "Відділення №4: вул. Достоєвського, 5",
    "Відділення №5: пл. Юрія Руднєва, 30",
    "Поштомат №2001: вул. Сумська, 10"
  ]
};

// Fallback generator for other cities
const generateWarehouses = (city: string) => {
  if (!city) return [];

  // If we have real data for this city, use it
  if (REAL_BIG_CITIES_WAREHOUSES[city]) {
    return REAL_BIG_CITIES_WAREHOUSES[city];
  }
  
  const STREETS = [
    "Незалежності", "Соборна", "Київська", "Шевченка", "Франка", "Лесі Українки", 
    "Миру", "Перемоги", "Грушевського", "Свободи", "Центральна", "Захисників України",
    "Героїв Майдану", "Козацька", "Дніпровська", "Садова", "Вокзальна", "Європейська",
    "Харківська", "Львівська", "Одеська", "Полтавська", "Сумська"
  ];

  // Deterministic generation
  const hash = city.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const count = Math.max(3, (hash % 15) + 3); 

  return Array.from({ length: count }, (_, i) => {
    const street = STREETS[(hash + i) % STREETS.length];
    const building = ((hash * (i + 1)) % 100) + 1;
    // Mix of Cargo and Postal branches
    const type = i % 4 === 0 ? "Вантажне відділення" : "Відділення";
    return `${type} №${i + 1}: вул. ${street}, ${building}`;
  });
};

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
    paymentMethod: 'card'
  });

  const [filteredCities, setFilteredCities] = useState<string[]>([]);
  const [showCityDropdown, setShowCityDropdown] = useState(false);
  const [warehouses, setWarehouses] = useState<string[]>([]);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowCityDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (formData.city && UKRAINIAN_CITIES.includes(formData.city)) {
      setWarehouses(generateWarehouses(formData.city));
    } else {
      setWarehouses([]);
    }
  }, [formData.city]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    if (name === 'city') {
      const filtered = UKRAINIAN_CITIES.filter(city => 
        city.toLowerCase().startsWith(value.toLowerCase()) || city.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredCities(filtered);
      setShowCityDropdown(true);
      setFormData(prev => ({ ...prev, warehouse: '' }));
    }
  };

  const selectCity = (city: string) => {
    setFormData(prev => ({ ...prev, city, warehouse: '' }));
    setShowCityDropdown(false);
    setWarehouses(generateWarehouses(city));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const orderData = {
      customer: {
        firstName: formData.firstName,
        lastName: formData.lastName,
        phone: formData.phone,
        email: formData.email
      },
      delivery: {
        city: formData.city,
        warehouse: formData.warehouse,
        method: 'nova_poshta'
      },
      paymentMethod: formData.paymentMethod,
      items: items.map(item => ({ product_id: item.id, quantity: item.quantity })),
      total: totalAmount
    };

    const response = await api.createOrder(orderData);
    if (response) {
      alert('Замовлення успішно оформлено!');
      navigateTo('home');
    }
  };

  if (items.length === 0) {
      return (
          <div className="w-full max-w-[1352px] mx-auto px-4 py-20 text-center">
              <h2 className="text-2xl font-bold mb-4">Ваш кошик порожній</h2>
              <button onClick={() => navigateTo('catalog')} className="text-amber-500 underline">Перейти до каталогу</button>
          </div>
      )
  }

  return (
    <div className="w-full max-w-[1352px] mx-auto px-4 py-6">
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-2 text-xs text-amber-400 mb-8">
        <button onClick={() => navigateTo('home')}><House size={16} className="fill-gray-400 text-gray-400 hover:text-amber-500 hover:fill-amber-500 transition-colors" /></button>
        <ChevronRight size={14} className="text-gray-300" />
        <button onClick={() => navigateTo('cart')} className="text-amber-500 font-medium hover:underline">Кошик</button>
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
                    <div key={item.id} className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center p-4 border-b border-gray-100 last:border-0 min-h-[100px]">
                        {/* Image */}
                        <div className="col-span-1 md:col-span-3 flex justify-center md:justify-start">
                            <div className="w-20 h-20 flex items-center justify-center">
                                <img src={item.image} alt={item.name} className="max-h-full max-w-full object-contain" />
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
                                <span className="w-10 h-10 flex items-center justify-center text-sm font-bold text-gray-900 border-x border-gray-200 bg-white">{item.quantity}</span>
                                <span className="w-10 h-10 flex items-center justify-center text-gray-500">+</span>
                            </div>
                        </div>
                        {/* Price */}
                        <div className="col-span-1 md:col-span-2">
                            <span className="md:hidden font-bold mr-2 text-xs uppercase text-gray-500">Ціна:</span>
                            <span className="font-bold text-gray-900 text-sm whitespace-nowrap">${item.price.toFixed(2)}</span>
                        </div>
                    </div>
                ))}
            </div>

            {/* Total Bar */}
            <div className="bg-amber-400 text-white font-bold uppercase p-4 pr-8 flex justify-end items-center gap-12 rounded-b-sm">
                <span className="text-sm">Усього</span>
                <span className="text-xl">$ {totalAmount.toLocaleString().replace(/,/g, ' ')}</span>
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
                        <div className="bg-[#EDEDED] rounded-sm px-2 py-1 relative" ref={dropdownRef}>
                            <input 
                                type="text" 
                                name="city"
                                required
                                value={formData.city}
                                onChange={handleInputChange}
                                onFocus={() => {
                                    if (!formData.city) setFilteredCities(UKRAINIAN_CITIES.slice(0, 10));
                                    setShowCityDropdown(true);
                                }}
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
                                    {filteredCities.length > 0 ? (
                                        filteredCities.map((city, idx) => (
                                            <li 
                                                key={idx} 
                                                onClick={() => selectCity(city)}
                                                className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm text-gray-900"
                                            >
                                                {city}
                                            </li>
                                        ))
                                    ) : (
                                        <li className="px-4 py-2 text-sm text-gray-400">Нічого не знайдено</li>
                                    )}
                                </ul>
                            )}
                        </div>

                        {/* Nova Poshta Radio */}
                        <div className="flex items-center gap-3 my-4">
                            <input 
                                type="radio" 
                                checked={true} 
                                readOnly 
                                className="text-amber-400 focus:ring-amber-400 w-4 h-4" 
                            />
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
                                disabled={!formData.city}
                            >
                                <option value="" className="text-gray-500">Виберіть відділення</option>
                                {warehouses.map((wh, idx) => (
                                    <option key={idx} value={wh}>{wh}</option>
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
                            <span className="text-sm text-gray-900">Онлайн–платежі Visa i MasterCard (LiqPay)</span>
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
                className="bg-amber-400 hover:bg-amber-500 text-white font-bold uppercase text-xs px-8 py-4 rounded-sm shadow-md hover:shadow-lg transition-colors w-full md:w-auto"
            >
                ОФОРМИТИ ЗАМОВЛЕННЯ
            </button>
        </div>

      </form>
    </div>
  );
};

export default CheckoutPage;

