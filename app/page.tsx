import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Brain, Users, Target, TrendingUp, ArrowRight, Star } from "lucide-react"
import { UserJourneyDemo } from "@/components/user-journey-demo"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Brain className="h-8 w-8 text-blue-600" />
            <span className="text-2xl font-bold text-gray-900">NeuroCoach</span>
          </div>
          <nav className="hidden md:flex items-center gap-6">
            <Link href="#features" className="text-gray-600 hover:text-gray-900">
              Возможности
            </Link>
            <Link href="#pricing" className="text-gray-600 hover:text-gray-900">
              Тарифы
            </Link>
            <Link href="#about" className="text-gray-600 hover:text-gray-900">
              О нас
            </Link>
          </nav>
          <div className="flex items-center gap-4">
            <Link href="/demo">
              <Button variant="ghost">Демо</Button>
            </Link>
            <Link href="/auth/signin">
              <Button variant="ghost">Войти</Button>
            </Link>
            <Link href="/auth/signup">
              <Button>Начать</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center max-w-4xl">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            Платформа для
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
              {" "}
              нейро-коучинга
            </span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Современные методы коучинга с использованием нейронауки для достижения ваших целей и личностного роста
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/auth/signup">
              <Button size="lg" className="text-lg px-8">
                Начать бесплатно
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href="/demo">
              <Button size="lg" variant="outline" className="text-lg px-8 bg-transparent">
                Попробовать демо
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 bg-white">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Возможности платформы</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Все инструменты для эффективного коучинга в одном месте
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardHeader>
                <Brain className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                <CardTitle>Нейро-анализ</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Анализ поведенческих паттернов и когнитивных процессов для персонализированного подхода
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardHeader>
                <Target className="h-12 w-12 text-green-600 mx-auto mb-4" />
                <CardTitle>Постановка целей</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  SMART-цели с нейронаучным обоснованием для максимальной эффективности достижения
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardHeader>
                <TrendingUp className="h-12 w-12 text-purple-600 mx-auto mb-4" />
                <CardTitle>Отслеживание прогресса</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Детальная аналитика и визуализация вашего развития с научно обоснованными метриками
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardHeader>
                <Users className="h-12 w-12 text-orange-600 mx-auto mb-4" />
                <CardTitle>Сообщество</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>Взаимодействие с другими участниками и профессиональными коучами</CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Отзывы клиентов</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="hover:shadow-lg transition-shadow">
                <CardContent className="pt-6">
                  <div className="flex mb-4">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star key={star} className="h-5 w-5 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <p className="text-gray-600 mb-4">
                    "Платформа помогла мне структурировать мои цели и достичь результатов, о которых я даже не мечтал.
                    Научный подход действительно работает!"
                  </p>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full flex items-center justify-center text-white font-semibold">
                      А{i}
                    </div>
                    <div>
                      <p className="font-semibold">Анна Петрова</p>
                      <p className="text-sm text-gray-500">Предприниматель</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Demo */}
      <section className="py-20 px-4">
        <UserJourneyDemo />
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="container mx-auto text-center">
          <h2 className="text-4xl font-bold mb-4">Готовы начать свой путь?</h2>
          <p className="text-xl mb-8 opacity-90">Присоединяйтесь к тысячам людей, которые уже изменили свою жизнь</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/auth/signup">
              <Button size="lg" variant="secondary" className="text-lg px-8">
                Начать бесплатно
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href="/demo">
              <Button
                size="lg"
                variant="outline"
                className="text-lg px-8 bg-transparent border-white text-white hover:bg-white hover:text-blue-600"
              >
                Попробовать демо
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-4">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Brain className="h-6 w-6" />
                <span className="text-xl font-bold">NeuroCoach</span>
              </div>
              <p className="text-gray-400">Современная платформа для личностного развития на основе нейронауки</p>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Продукт</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link href="#" className="hover:text-white">
                    Возможности
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white">
                    Тарифы
                  </Link>
                </li>
                <li>
                  <Link href="/demo" className="hover:text-white">
                    Демо
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Компания</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link href="#" className="hover:text-white">
                    О нас
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white">
                    Блог
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white">
                    Карьера
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Поддержка</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link href="#" className="hover:text-white">
                    Помощь
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white">
                    Контакты
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white">
                    Статус
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 NeuroCoach. Все права защищены.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
