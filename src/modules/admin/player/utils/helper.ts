import { Currency, ExchangeRate } from 'src/common/utils/type';
import { ServicePrice } from '../../tournament/utils/const';
import { Country, StandardColor } from '../../tournament/utils/type';
import {
  ClothesDetailFee,
  PlayerDetailFee,
  PlayerFee,
} from '../entity/player.fee.entity';
import { PlayerDocument } from '../schema/player.schema';

export const calculateDetailFee = (player: PlayerDocument): PlayerFee => {
  const { currency, exchange_rate: exchangeRate } = getCurrencyFromCountry(
    player.country,
  );
  let totalFee: number = ServicePrice.base;
  let detailFee: PlayerDetailFee = {
    base: ServicePrice.base,
    lunch: 0,
    bus: 0,
    jerseys: {
      black: [],
      white: [],
      price: 0,
    },
    shorts: {
      black: [],
      white: [],
      price: 0,
    },
    disc: {
      quantity: 0,
      price: 0,
    },
  };

  // LUNCH
  if (player.services.lunch.value) {
    detailFee.lunch = player.services.lunch.price;
    totalFee += player.services.lunch.price;
  }

  // BUS
  if (player.services.bus.value) {
    detailFee.bus = player.services.bus.price;
    totalFee += player.services.bus.price;
  }

  // DISC
  if (player.services.disc.quantity > 0) {
    detailFee.disc.quantity = player.services.disc.quantity;
    detailFee.disc.price =
      player.services.disc.quantity * player.services.disc.price;
    totalFee += detailFee.disc.price;
  }

  // JERSEYS
  if (player.services.jerseys.length) {
    const { black, white, price } = calculateClothesFee(
      player.services.jerseys,
    );

    detailFee = {
      ...detailFee,
      jerseys: {
        black,
        white,
        price,
      },
    };

    totalFee += price;
  }

  // SHORTS
  if (player.services.shorts.length) {
    const { black, white, price } = calculateClothesFee(player.services.shorts);

    detailFee = {
      ...detailFee,
      shorts: {
        black,
        white,
        price,
      },
    };

    totalFee += price;
  }

  return {
    playerCode: player.code,
    totalFee: totalFee,
    totalForeign: Math.ceil(totalFee / exchangeRate),
    currency,
    exchangeRate,
    detail: detailFee,
  };
};

export const getCurrencyFromCountry = (
  country: string,
): { currency: string; exchange_rate: number } => {
  let exchangeRate: number;
  let currency: string;

  switch (country) {
    case Country.Vietnam: {
      currency = Currency.Vietnam;
      exchangeRate = ExchangeRate.Vietnam;
      break;
    }
    case Country.Philipines: {
      currency = Currency.Philipines;
      exchangeRate = ExchangeRate.Philipines;
      break;
    }
    case Country.Malaysia: {
      currency = Currency.Malaysia;
      exchangeRate = ExchangeRate.Malaysia;
      break;
    }
    case Country.Singapore: {
      currency = Currency.Singapore;
      exchangeRate = ExchangeRate.Singapore;
      break;
    }
    default: {
      currency = Currency.Default;
      exchangeRate = ExchangeRate.Default;
      break;
    }
  }

  return {
    currency,
    exchange_rate: exchangeRate,
  };
};

export const calculateClothesFee = (
  data: ClothesDetailFee[],
): { black: ClothesDetailFee[]; white: ClothesDetailFee[]; price: number } => {
  let blackClothes: ClothesDetailFee[] = [];
  data
    .filter((item) => item.color === StandardColor.Black)
    .map((item) => {
      if (blackClothes.length === 0) {
        blackClothes.push(item);
      } else {
        blackClothes = blackClothes.map((blackItem) => {
          if (blackItem.size === item.size) {
            return {
              ...blackItem,
              quantity: blackItem.quantity + item.quantity,
            };
          }
          return blackItem;
        });
      }
    });

  let whiteClothes: ClothesDetailFee[] = [];
  data
    .filter((item) => item.color === StandardColor.Black)
    .map((item) => {
      if (whiteClothes.length === 0) {
        whiteClothes.push(item);
      } else {
        whiteClothes = whiteClothes.map((whiteItem) => {
          if (whiteItem.size === item.size) {
            return {
              ...whiteItem,
              quantity: whiteItem.quantity + item.quantity,
            };
          }
          return whiteItem;
        });
      }
    });

  const clothesPrice =
    (whiteClothes.length + blackClothes.length) * ServicePrice.jerseys;

  return {
    black: blackClothes,
    white: whiteClothes,
    price: clothesPrice,
  };
};
