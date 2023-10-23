import { useCallback, useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { ProductCard } from "../../components/product-card/ProductCard";
import Wrapper from "../../components/wrapper/Wrapper";
import * as productJson from "../../../public/assets/productsList.json";
import Loader from "../../components/loader/Loader";

export interface IProductSchema {
  id: number;
  name: string;
  img: string;
  price: number;
  discount: number;
  description: string;
  sizes: Size[];
  colors: string[];
  images: string[];
}

export interface Size {
  size: string;
  available: boolean;
}
const Error = ({ children }: any) => (
  <div className="text-red-600 mt-4 text-sm font-medium">{children}</div>
);
const Product = () => {
  const {
    register,
    handleSubmit,
    setValue,
    getValues,
    formState: { errors },
  } = useForm({ defaultValues: { quantity: 1, size: null, color: null } });
  const { id } = useParams();
  const [productData, setProductData] = useState<IProductSchema | null>(null);
  const [relatedProduct, setRelatedProduct] = useState<IProductSchema[]>([]);
  const [isLoding, setIsLoading] = useState<boolean>(true);
  const [imageIdex, setImageIdex] = useState<number>(2);
  const navigate = useNavigate();
  const ref = useRef<HTMLDivElement>(null);
  const fetchProduct = useCallback((id: any) => {
    const { data } = productJson;
    const product = data.filter((response: any) => response.id === +id!)[0];
    const random = Math.floor(Math.random() * (data.length - 3));
    setRelatedProduct(data.slice(random, random + 3));
    console.log(product);
    setProductData({ ...product });
    setIsLoading(false);
  }, []);

  const submitForm = (data: any) => {
    console.log(data);
  };
  const handleQttyChange = (action: "+" | "-") => {
    const val = getValues("quantity");
    if (action == "+") {
      setValue("quantity", val + 1);
    } else {
      if (val < 2) return;
      setValue("quantity", val - 1);
    }
  };
  useEffect(() => {
    fetchProduct(id);
    console.log(id);
  }, [id, fetchProduct]);

  return (
    <>
      {isLoding ? (
        <div className="flex flex-col justify-center items-center w-full h-screen">
          <Loader />
        </div>
      ) : (
        <div
          ref={ref}
          className="flex flex-col justify-center items-center w-full"
        >
          <Wrapper key={id} className="w-full">
            {productData && (
              <div className="relative w-full mx-auto max-w-screen-xl px-4 md:px-24 py-8">
                <div className="  grid grid-cols-1 items-start  gap-24 md:grid-cols-[1fr_1fr]">
                  <div className="md:min-w-[20rem] flex flex-col-reverse justify-center items-center md:items-start md:grid  gap-4 md:grid-cols-[auto_1fr]">
                    <div className="flex sm:justify-center md:flex-col gap-4 w-full overflow-auto ">
                      {productData.images.map((item, idx) => (
                        <img
                          onClick={() => setImageIdex(idx)}
                          alt="Les Paul"
                          src={`${"../nike-store-v1/"}${item}`}
                          className={`cursor-pointer w-12 h-12 aspect-square rounded-lg object-cover ${
                            imageIdex == idx && "border-2"
                          }`}
                        />
                      ))}
                    </div>
                    <div className="overflow-hidden md:w-full   aspect-square">
                      <div
                        style={{
                          top: `-${imageIdex * 100}%`,
                        }}
                        className="transition-all relative md:w-full  aspect-square  rounded-lg object-cover"
                      >
                        {productData.images.map((item, index) => (
                          <img
                            alt="Les Paul"
                            key={index}
                            src={`${"../nike-store-v1/"}${item}`}
                            className="w-96 aspect-square md:w-full rounded-lg object-cover"
                          />
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="sticky top-0">
                    <strong className="rounded-full border border-blue-600 bg-gray-100 px-3 py-0.5 text-xs  tracking-wide text-blue-600 ">
                      Pre Order
                    </strong>

                    <div className="mt-8 flex justify-between">
                      <div className="max-w-[35ch] space-y-2">
                        <h1 className="text-xl font-bold sm:text-3xl  ">
                          {productData.name}
                        </h1>

                        <p className="text-lg font-semibold">
                          Highest Rated Product
                        </p>
                      </div>
                    </div>
                    <div className="flex justify-between items-center pt-4">
                      <p className="text-lg font-bold ">
                        MRP : ₹ {productData.price}{" "}
                        <span className="line-through text-slate-400">
                          ₹{" "}
                          {Math.round(
                            (100 / (100 - productData.discount)) *
                              productData.price
                          )}
                        </span>
                      </p>
                      <p className="ml-auto font-semibold text-green-600 text-base">
                        {productData.discount}% off
                      </p>
                    </div>

                    <div className="mt-4">
                      <div className="prose max-w-none">
                        <p>{productData.description}</p>
                      </div>
                    </div>

                    <form className="mt-8" onSubmit={handleSubmit(submitForm)}>
                      <fieldset>
                        <legend className="mb-1 text-sm font-medium">
                          Color
                        </legend>

                        <div className="flex flex-wrap gap-1">
                          {productData.colors.map((item, index) => (
                            <label
                              htmlFor={`color_${item.split(" ").join("")}`}
                              className="cursor-pointer"
                              key={index}
                            >
                              <input
                                type="radio"
                                {...register("color", {
                                  required: true,
                                })}
                                id={`color_${item.split(" ").join("")}`}
                                value={item}
                                className="peer sr-only"
                              />

                              <span className="group inline-block rounded-full border px-3 py-1 text-xs font-medium peer-checked:bg-black peer-checked:text-white">
                                {item}
                              </span>
                            </label>
                          ))}
                        </div>
                        {errors.color && <Error>Color is required.</Error>}
                      </fieldset>

                      <fieldset className="mt-4">
                        <legend className="mb-1 text-sm font-medium">
                          Size
                        </legend>

                        <div className="flex flex-wrap gap-1">
                          {productData.sizes.map((item, index) => (
                            <label
                              key={index}
                              htmlFor={`size_${item.size}`}
                              className="cursor-pointer"
                            >
                              <input
                                disabled={!item.available}
                                type="radio"
                                {...register("size", {
                                  required: true,
                                })}
                                value={item.size}
                                id={`size_${item.size}`}
                                className="peer sr-only"
                              />

                              <span
                                className={`group inline-flex h-8  w-12 items-center justify-center rounded-full border text-xs font-medium peer-checked:bg-black peer-checked:text-white ${
                                  !item.available &&
                                  "bg-gray-200 cursor-not-allowed"
                                }`}
                              >
                                UK {item.size}
                              </span>
                            </label>
                          ))}
                        </div>
                        {errors.size && <Error>Size is required.</Error>}
                      </fieldset>
                      <div className="mt-8 flex gap-4">
                        <div>
                          <label htmlFor="quantity" className="mr-4">
                            Qty :
                          </label>
                          <button
                            onClick={() => {
                              handleQttyChange("-");
                            }}
                            type="button"
                            className={`inline-flex h-8  w-8 items-center justify-center rounded-full border text-xs font-medium cursor-pointer hover:bg-gray-200 disabled:cursor-not-allowed`}
                          >
                            -
                          </button>
                          <input
                            type="number"
                            id="quantity"
                            min="1"
                            {...register("quantity", {
                              required: true,
                              valueAsNumber: true,
                            })}
                            className="w-12 rounded border-gray-200 py-3 text-center text-xs [-moz-appearance:_textfield] [&::-webkit-inner-spin-button]:m-0 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:m-0 [&::-webkit-outer-spin-button]:appearance-none"
                          />
                          <button
                            onClick={() => {
                              handleQttyChange("+");
                            }}
                            type="button"
                            className="inline-flex h-8  w-8 items-center justify-center rounded-full border text-xs font-medium cursor-pointer hover:bg-gray-200"
                          >
                            +
                          </button>
                        </div>
                      </div>
                      <button
                        type="submit"
                        className="mt-4 block rounded bg-green-600 px-5 py-3 text-base font-medium text-white hover:bg-green-500 w-full"
                      >
                        Add to Cart
                      </button>
                      <button
                        type="submit"
                        className="mt-4 block rounded border border-green-600 px-5 py-3 text-base font-medium text-green-600 hover:border-green-500 w-full"
                      >
                        Add to Wishlist
                      </button>
                    </form>
                  </div>
                </div>
              </div>
            )}
          </Wrapper>
          <Wrapper>
            <div className="px-4 md:px-24">
              <div className="text-2xl py-4">You May Also Like</div>
              <div className="flex flex-col md:flex-row md:justify-between gap-10">
                {relatedProduct.map((item, index) => (
                  <ProductCard
                    {...item}
                    key={index}
                    onClick={() => {
                      navigate(`/product/${item.id}`);
                      ref.current?.scrollIntoView({
                        behavior: "smooth",
                      });
                    }}
                  />
                ))}
              </div>
            </div>
          </Wrapper>
        </div>
      )}
    </>
  );
};

export default Product;
