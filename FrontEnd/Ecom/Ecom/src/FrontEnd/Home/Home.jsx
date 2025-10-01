
import Sidebar from './Sidebar'
import ProductList from './ProductList'
import Carousel from './Carousel'
import FeaturedDesigners from '../Feature/FeaturedDesigner'
import SidebarCategories from './SidebarCategories'

export default function Home () {
  return (
    <>
        <Carousel />
        <FeaturedDesigners />
       
       <div className="flex justify-evenly">
             
             <SidebarCategories />
             <ProductList />
             
       </div>
        
       
    </>
  )
}
